import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserRole } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { env } from 'src/utils/env-validator';
import { TLoginDto } from './dto/login.dto';
import { TRegisterUser } from './dto/register.dto';
import { TRefreshTokenPayload } from 'src/common/types/tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(registerUserDto: TRegisterUser) {
    const hashedPassword = await argon2.hash(registerUserDto.password);

    return this.userService.create({
      username: registerUserDto.username,
      name: registerUserDto.name,
      password: hashedPassword,
      role: registerUserDto.role,
    });
  }

  async login(loginDto: TLoginDto) {
    const userData = await this.userService.findByEmail(loginDto.username);

    if (!userData) throw new BadRequestException('Invalid credentials');

    const validatedPassword = await argon2.verify(
      userData.password,
      loginDto.password,
    );

    if (!validatedPassword)
      throw new BadRequestException('Invalid credentials');

    const { accessToken, refreshToken } = await this.generateTokens(
      userData.id,
      userData.role,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateTokens(userId: string, role: UserRole = UserRole.USER) {
    const refreshTokenId = nanoid();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          iss: 'auth-service',
          sub: userId,
          role,
        },
        { expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        {
          iss: 'auth-service',
          jti: refreshTokenId,
          sub: userId,
        },
        { expiresIn: '7d' },
      ),
    ]);

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.prismaService.refreshToken.create({
      data: {
        userId,
        id: refreshTokenId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken: string) {
    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<TRefreshTokenPayload>(refreshToken, {
          ignoreExpiration: false,
          secret: env.JWT_SECRET,
        });

      await this.prismaService.refreshToken.delete({
        where: { userId, id: tokenPayload.jti },
      });

      return {
        message: 'User logged out successfully',
      };
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const tokenPayload =
        await this.jwtService.verifyAsync<TRefreshTokenPayload>(refreshToken, {
          ignoreExpiration: false,
          secret: env.JWT_SECRET,
        });

      const storedToken = await this.prismaService.refreshToken.findUnique({
        where: { userId: tokenPayload.sub, id: tokenPayload.jti },
      });

      if (!storedToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const isTokenValid = await argon2.verify(storedToken.token, refreshToken);

      if (!isTokenValid) {
        throw new BadRequestException('Invalid refresh token');
      }

      const user = await this.userService.findById(tokenPayload.sub);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokens(user.id, user.role);

      await this.prismaService.refreshToken.delete({
        where: { userId: tokenPayload.sub, id: tokenPayload.jti },
      });

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
