import { Test, TestingModule } from '@nestjs/testing';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

describe('RoomController', () => {
  let controller: RoomController;

  const mockRoomService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomController],
      providers: [RoomService],
    }).overrideProvider(RoomService).useValue(mockRoomService).compile();

    controller = module.get<RoomController>(RoomController);
  })

  it('Should be able to create a room', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRoomService.create.mockResolvedValue(room)

    expect(await controller.create(room)).toEqual(room)

    expect(mockRoomService.create).toHaveBeenCalledWith(room)
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

    mockRoomService.findAll.mockResolvedValue(rooms)

    expect(await controller.findAll()).toEqual(rooms)

    expect(mockRoomService.findAll).toHaveBeenCalled()
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

    mockRoomService.findOne.mockResolvedValue(room)

    expect(await controller.findOne('fakeId')).toEqual(room)

    expect(mockRoomService.findOne).toHaveBeenCalledWith('fakeId')
  })

  it('Should be able to update a room', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRoomService.update.mockResolvedValue(room)

    expect(await controller.update('fakeId', room)).toEqual(room)

    expect(mockRoomService.update).toHaveBeenCalledWith('fakeId', room)
  })

  it('Should be able to update the status of a room', async () => {
    const room = {
      id: 'fakeId',
      name: 'room name',
      maxCapacity: 2,
      description: 'room description',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRoomService.updateStatus.mockResolvedValue(room)

    expect(await controller.updateStatus('fakeId', false)).toEqual(room)

    expect(mockRoomService.updateStatus).toHaveBeenCalledWith('fakeId', {isActive: false})
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

    mockRoomService.remove.mockResolvedValue(room)

    expect(await controller.remove('fakeId')).toEqual(room)

    expect(mockRoomService.remove).toHaveBeenCalledWith('fakeId')
  })
})
