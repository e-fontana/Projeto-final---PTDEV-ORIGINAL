/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';


describe('RoomService', () => {
  let roomService: RoomService
  let prismaService: PrismaService

  const mockPrismaService = {
    room: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService, PrismaService],
    }).overrideProvider(PrismaService).useValue(mockPrismaService).compile();

    roomService = module.get<RoomService>(RoomService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('Should be able to create a room', async () => {
    
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
    }
    
    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrismaService.room.create.mockResolvedValue(room)

    expect(await roomService.create(roomDto)).toEqual(room)

    expect(prismaService.room.create).toHaveBeenCalledWith({data: roomDto})
  })

  it('Should be able to find all rooms', async () => {
    const rooms = [
      {
        id: 'fakeId 1',
        name: 'room name 1',
        maxCapacity: 1,
        description: 'room description 1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fakeId 2',
        name: 'room name 2',
        maxCapacity: 2,
        description: 'room description 2',
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'fakeId 3',
        name: 'room name 3',
        maxCapacity: 3,
        description: 'room description 3',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockPrismaService.room.findMany.mockResolvedValue(rooms)

    expect(await roomService.findAll()).toEqual(rooms)

    expect(prismaService.room.findMany).toHaveBeenCalled()
  })

  it('Should be able to find a room by id', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrismaService.room.findUnique.mockResolvedValue(room)

    expect(await roomService.findOne('fakeId')).toEqual(room)

    expect(prismaService.room.findUnique).toHaveBeenCalledWith({where: {id: 'fakeId'}})
  })

  it('Should be able to update a room', async () => {
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
    }
    
    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrismaService.room.update.mockResolvedValue(room)

    expect(await roomService.update('fakeId', roomDto)).toEqual(room)

    expect(prismaService.room.update).toHaveBeenCalledWith({where: { id: 'fakeId' }, data: roomDto})
  })

  it('Should be able to update the status of a room', async () => {
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: false,
    }
    
    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }


    mockPrismaService.room.update.mockResolvedValue(room)

    expect(await roomService.updateStatus('fakeId', roomDto)).toEqual(room)

    expect(prismaService.room.update).toHaveBeenCalledWith({where: { id: 'fakeId' }, data: { isActive: roomDto.isActive }})
  })

  it('Should be able to delete a room', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockPrismaService.room.delete.mockResolvedValue(room)

    expect(await roomService.remove('fakeId')).toEqual(room)

    expect(prismaService.room.delete).toHaveBeenCalledWith({where: { id: 'fakeId' }})
  })

  it('Should be able to find a room', async () => {
    mockPrismaService.room.findUnique.mockResolvedValue(null)

    await expect(roomService.findOne('fakeId')).rejects.toThrow(NotFoundException)

    expect(prismaService.room.findUnique).toHaveBeenCalledWith({where: { id: 'fakeId' }})
  })
});