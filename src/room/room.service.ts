import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomDto: CreateRoomDTO) {
    return this.prismaService.room.create({
      data: {
        name: createRoomDto.name,
        maxCapacity: createRoomDto.maxCapacity,
        description: createRoomDto.description,
        isActive: createRoomDto.isActive,
      },
    });
  }

  async findAll() {
    return this.prismaService.room.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDTO) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    return this.prismaService.room.update({
      where: {
        id,
      },
      data: {
        name: updateRoomDto.name,
        maxCapacity: updateRoomDto.maxCapacity,
        description: updateRoomDto.description,
        isActive: updateRoomDto.isActive,
      },
    });
  } 

  async updateStatus(id: string, updateRoomDto: UpdateStatusDTO) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    return this.prismaService.room.update({
      where: {
        id,
      },
      data: {
        isActive: updateRoomDto.isActive,
      },
    });
  }

  async remove(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id,
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found.');
    }

    return this.prismaService.room.delete({
      where: {
        id,
      },
    });
  }
}
