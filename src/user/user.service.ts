import { BadRequestException, Injectable } from '@nestjs/common';
import { TRegisterUser } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TUpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  deleteUser(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: TRegisterUser) {
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
        role: data.role || 'USER',
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
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  update(id: string, data: TUpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }
}
