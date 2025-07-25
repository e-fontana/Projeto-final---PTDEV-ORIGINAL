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
        email: data.username,
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
        email: data.username,
        name: data.name,
        password: data.password,
      },
      omit: {
        password: true,
      },
    });

    return createdUser;
  }

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  deleteUser(id: string) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  updatePassword(username: string, newPassword: string) {
    return this.prismaService.user.update({
      where: { email: username },
      data: {
        password: newPassword,
      },
    });
  }
}
