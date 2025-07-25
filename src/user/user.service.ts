import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: AuthRegisterDto) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        id: true,
      },
    });

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });

    return createdUser;
  }

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findWithoutPassword(id: string){
    const user = await this.prismaService.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  };

  async update(id: string, data: TUpdateUserDto) {
    const userExists = await this.prismaService.user.findUnique({
        where: { id: id },
      });

    if (!userExists) {
        throw new NotFoundException('User not found');
      }

    return await this.prismaService.user.update({
      where: { id: id },
      data: {
        name: data.name,
      },
    });
  }

  async delete(id: string) {
    const userExists = await this.prismaService.user.findUnique({
      where: { id: id },
    })

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return await this.prismaService.user.delete({
      where: { id: id },
    })

  updatePassword(username: string, newPassword: string) {
    return this.prismaService.user.update({
      where: { email: username },
      data: {
        password: newPassword,
      },
    });
  }
}
