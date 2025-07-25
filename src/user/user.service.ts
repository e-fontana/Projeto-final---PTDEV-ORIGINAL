import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TRegisterUser } from '../auth/dto/register.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { TUpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: TRegisterUser) {
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
  }
}
