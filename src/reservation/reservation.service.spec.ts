import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let prismaServiceMock: {
    reservation: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    },
    user: {
      findUnique: jest.Mock;
    };
  }
  beforeEach(async () => {
    prismaServiceMock = {
      reservation: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
       user: {
          findUnique: jest.fn(),
        }
      
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should create a reservation', async () => {
    const fakeReservation = {
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2030-10-01T10:00:00Z'),
      endAt: new Date('2030-10-01T12:00:00Z'),
      status: true,
    }

    prismaServiceMock.reservation.create.mockResolvedValue(fakeReservation);

    const dto = {
      roomId: fakeReservation.roomId,
      startAt: fakeReservation.startAt,
      endAt: fakeReservation.endAt,
      status: fakeReservation.status,
    }
    const result = await service.create(fakeReservation.userId, dto)
    expect(result).toEqual(fakeReservation);
    expect(prismaServiceMock.reservation.create).toHaveBeenCalledWith({
      data: {
        ...dto,
        userId: fakeReservation.userId,
      }
    })
  });

  it('should be able to throw error if reservation already exists', async () => {
     prismaServiceMock.reservation.findFirst.mockResolvedValue({ id: 'resv1'});
     const dto = {
      roomId: 'room123',
      startAt: new Date('2030-10-01T10:00:00Z'),
      endAt: new Date('2030-10-01T12:00:00Z'),
      status: false,
     }

     await expect(service.create('user123', dto)).rejects.toThrow('Reservation already exists'); 
})

  it('should find all reservations by user', async () => {
    const fakeReservations = [
      {id: 'resv1', userId: 'user123', roomId: 'room123', startAt: new Date('2030-10-01T10:00:00Z'), endAt: new Date('2030-10-01T12:00:00Z')},
      {id: 'resv2', userId: 'user123', roomId: 'room456', startAt: new Date('2030-10-01T13:00:00Z'), endAt: new Date('2030-10-01T14:00:00Z')},
    ]
    
    prismaServiceMock.user.findUnique.mockResolvedValue({ id: 'user123' });
    prismaServiceMock.reservation.findMany.mockResolvedValue(fakeReservations);
    
    const result = await service.findAllByUser('user123');
    
    expect(result).toEqual(fakeReservations);
    expect(prismaServiceMock.reservation.findMany).toHaveBeenCalledWith({
      where: {userId: 'user123'},
      orderBy: { createdAt: 'desc' },
    })
  })

  it('should be able to throw error if reservations or user not found', async () => {
    prismaServiceMock.reservation.findMany.mockResolvedValue(null);
    await expect(service.findAllByUser('user123')).rejects.toThrow(NotFoundException);
  })

  it('should find a reservation by user', async () => { 
    const fakeReservation = {id: 'resv1', userId: "user123", roomId: 'room123', startAt: new Date('2030-10-01T10:00:00Z'), endAt: new Date('2030-10-01T12:00:00Z')}
    prismaServiceMock.reservation.findFirst.mockResolvedValue(fakeReservation);
    const result = await service.findOne('user123', 'resv1');
    expect(result).toEqual(fakeReservation)
    expect(prismaServiceMock.reservation.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user123',
        id: 'resv1',
      }
    })
})
  
  it('should be able to cancel a reservation', async () => {
    const fakeReservation = {
      id: 'resv1',
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2030-10-01T10:00:00Z'),
      endAt: new Date('2030-10-01T12:00:00Z'),
      status: true,
    }

    prismaServiceMock.reservation.findFirst.mockResolvedValue(fakeReservation);
    prismaServiceMock.reservation.update.mockResolvedValue({ ...fakeReservation, status: false });

    const dto = {
      id: 'resv1',
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2030-10-01T10:00:00Z'),
      endAt: new Date('2030-10-01T12:00:00Z'),
      status: false,
    }
    const result = await service.cancel(fakeReservation.userId, dto.id);
    expect(result).toEqual({ ...fakeReservation, status: false });
    expect(prismaServiceMock.reservation.update).toHaveBeenCalledWith({
      where: {
        id: dto.id,
      },
      data: {
        status: false,
      }
    })
  })

  it('should be able to delete a reservation', async () => {
    const fakeReservation = {
      id: 'resv1',
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2030-10-01T10:00:00Z'),
      endAt: new Date('2030-10-01T12:00:00Z'),
      status: true,
    }
    prismaServiceMock.reservation.findFirst.mockResolvedValue(fakeReservation);
    prismaServiceMock.reservation.delete.mockResolvedValue(fakeReservation);
    const result = await service.delete(fakeReservation.userId, fakeReservation.id);
    expect(result).toEqual(fakeReservation);
    expect(prismaServiceMock.reservation.delete).toHaveBeenCalledWith({
      where: {
        id: fakeReservation.id,
      },
    })
  })

  it('should be able to find user history', async () => {
  const fakeReservations = [
      {id: 'resv1', userId: 'user123', roomId: 'room123', startAt: new Date('2030-10-01T10:00:00Z'), endAt: new Date('2030-10-01T12:00:00Z')},
      {id: 'resv2', userId: 'user123', roomId: 'room456', startAt: new Date('2030-10-01T13:00:00Z'), endAt: new Date('2030-10-01T14:00:00Z')},
    ]
      
  prismaServiceMock.user.findUnique.mockResolvedValue({ id: 'user123' });
  prismaServiceMock.reservation.findMany.mockResolvedValue(fakeReservations);
      
  const result = await service.findUserHistory('user123');
      
  expect(result).toEqual(fakeReservations);
  expect(prismaServiceMock.reservation.findMany).toHaveBeenCalledWith({
    where: {userId: 'user123'},
    orderBy: { createdAt: 'desc' },
    })
  })
})
