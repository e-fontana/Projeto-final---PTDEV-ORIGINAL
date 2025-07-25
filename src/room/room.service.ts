import { Injectable, NotFoundException } from '@nestjs/common';
import { TCreateRoom } from './dto/create-room.dto';
import { TUpdateRoom } from './dto/update-room.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async create(createRoomDto: TCreateRoom) {
    return await this.prismaService.room.create({
      data: {
        name: createRoomDto.name,
        maxCapacity: createRoomDto.maxCapacity,
        description: createRoomDto.description,
        isActive: createRoomDto.isActive,
      }
    })
  }

  async findAll() {
    return await this.prismaService.room.findMany({
      orderBy: {
        createdAt: 'desc',
      }
    })
  }

  async findOne(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id
      }
    })

    if(!room){
      throw new NotFoundException('Room not found.')
    }

    return room
  }

  async update(id: string, updateRoomDto: TUpdateRoom) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id
      }
    })

    if(!room){
      throw new NotFoundException('Room not found.')
    }

    return await this.prismaService.room.update({
      where: {
        id
      },
      data: {
        name: updateRoomDto.name,
        maxCapacity: updateRoomDto.maxCapacity,
        description: updateRoomDto.description,
        isActive: updateRoomDto.isActive,
      }
    })
  }

  async updateStatus(id: string, updateRoomDto: TUpdateRoom) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id
      }
    })

    if(!room){
      throw new NotFoundException('Room not found.')
    }

    return await this.prismaService.room.update({
      where: {
        id
      },
      data: {
        isActive: updateRoomDto.isActive,
      }
    })
  }

  async remove(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: {
        id
      }
    })

    if(!room){
      throw new NotFoundException('Room not found.')
    }

    return await this.prismaService.room.delete({
      where: {
        id
      }
    })
  }
}