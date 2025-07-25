import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../common/prisma/prisma.service';
import { RoomService } from './room.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';


describe('RoomService', () => {
  let roomService: RoomService;
  const mockPrismaService = {
    room: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    roomService = module.get<RoomService>(RoomService);
  });

  it('Should be able to create a room', async () => {
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
    };

    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.room.create.mockResolvedValue(room);

    expect(await roomService.create(roomDto)).toEqual(room);

    expect(mockPrismaService.room.create).toHaveBeenCalledWith({
      data: roomDto,
    });
  });

  it('Should be able to find all active rooms', async () => {
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
    ];

    const activeRooms = rooms.filter((room) => room.isActive);

    mockPrismaService.room.findMany.mockResolvedValue(activeRooms);

    expect(await roomService.findAll()).toEqual(activeRooms);

    expect(mockPrismaService.room.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('Should be able to find a room by id', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.room.findUnique.mockResolvedValue(room);

    expect(await roomService.findOne('fakeId')).toEqual(room);

    expect(mockPrismaService.room.findUnique).toHaveBeenCalledWith({
      where: { id: 'fakeId' },
    });
  });

  it('Should be able to update a room', async () => {
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
    };

    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.room.update.mockResolvedValue(room);

    expect(await roomService.update('fakeId', roomDto)).toEqual(room);

    expect(mockPrismaService.room.update).toHaveBeenCalledWith({
      where: { id: 'fakeId' },
      data: roomDto,
    });
  });

  it('Should be able to update the status of a room', async () => {
    const roomDto = {
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: false,
    };

    const room = {
      id: 'fakeId',
      ...roomDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.room.update.mockResolvedValue(room);

    expect(await roomService.updateStatus('fakeId', roomDto)).toEqual(room);

    expect(mockPrismaService.room.update).toHaveBeenCalledWith({
      where: { id: 'fakeId' },
      data: { isActive: roomDto.isActive },
    });
  });

  it('Should be able to delete a room', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.room.delete.mockResolvedValue(room);

    expect(await roomService.remove('fakeId')).toEqual(room);

    expect(mockPrismaService.room.delete).toHaveBeenCalledWith({
      where: { id: 'fakeId' },
    });
  });

  it('Should be able to find a room', async () => {
    mockPrismaService.room.findUnique.mockResolvedValue(null);

    await expect(roomService.findOne('fakeId')).rejects.toThrow(
      NotFoundException,
    );

    expect(mockPrismaService.room.findUnique).toHaveBeenCalledWith({
      where: { id: 'fakeId' },
    });
  });
});