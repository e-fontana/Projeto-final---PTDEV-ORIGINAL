import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { TAuthenticatedUser } from '../auth/strategies/jwt-auth.strategy';

describe('ReservationController', () => {
  let controller: ReservationController;

  const fakeReservation = {
      id: 'resv123',
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2023-10-01T10:00:00Z'),
      endAt: new Date('2023-10-01T12:00:00Z'),
      status: true,};   

  const mockService = {
    findAllByUser: jest.fn().mockResolvedValue([fakeReservation,
    {
      userId: 'user234',
      roomId: 'room234',
      startAt: new Date('2025-10-01T10:00:00Z'),
      endAt: new Date('2025-10-01T12:00:00Z'),
      status: true,
    },
    ]),

    create: jest.fn().mockResolvedValue(fakeReservation),

    findOne: jest.fn().mockResolvedValue(fakeReservation),

    delete: jest.fn().mockResolvedValue(fakeReservation),

    cancel: jest.fn().mockResolvedValue({
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2023-10-01T10:00:00Z'),
      endAt: new Date('2023-10-01T12:00:00Z'),
      status: false,
    }),

    findUserHistory: jest.fn().mockResolvedValue([fakeReservation,
    {
      userId: 'user234',
      roomId: 'room234',
      startAt: new Date('2025-10-01T10:00:00Z'),
      endAt: new Date('2025-10-01T12:00:00Z'),
      status: true,
    },
    ])
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        { provide: ReservationService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be able to return a create of a reservation', async () => {
    const fakeUser: TAuthenticatedUser = {
      sub: 'user123',
      role: 'USER',
    }

    const result = await controller.create(fakeUser, fakeReservation); 
    expect(mockService.create).toHaveBeenCalledWith(fakeUser.sub, fakeReservation);
    expect(result).toEqual(fakeReservation);
  })

  it('should be able to find all reservations of an user', async () => {
    const fakeUser: TAuthenticatedUser = { 
      sub: 'user123',
      role: 'USER',
    }

    const result = await controller.findAll(fakeUser);
    expect(mockService.findAllByUser).toHaveBeenCalledWith(fakeUser.sub);
    expect(result).toEqual([fakeReservation,
    {
      userId: 'user234',
      roomId: 'room234',
      startAt: new Date('2025-10-01T10:00:00Z'),
      endAt: new Date('2025-10-01T12:00:00Z'),
      status: true,
    }]);
  })

  it('should be able to find one of user reservations', async () => {
    const fakeUser: TAuthenticatedUser = { 
      sub: 'user123',
      role: 'USER',
    }

    const result = await controller.findOne(fakeUser, fakeReservation.id);
    expect(mockService.findOne).toHaveBeenCalledWith(fakeUser.sub, fakeReservation.id);
    expect(result).toEqual(fakeReservation);
  })

  it('should be able to delete a reservation', async () => {
    const fakeUser: TAuthenticatedUser = {
      sub: 'user123',
      role: 'USER',
    }

    const result = await controller.delete(fakeUser, fakeReservation.id);
    expect(mockService.delete).toHaveBeenCalledWith(fakeUser.sub, fakeReservation.id);
    expect(result).toEqual(fakeReservation);
  })

  it('should be able to cancel a reservation', async () => {
    const fakeUser: TAuthenticatedUser = {
      sub: 'user123',
      role: 'USER',
    }

    const dto = {
      id: 'resv123',
      userId: 'user123',
      roomId: 'room123',
      startAt: new Date('2023-10-01T10:00:00Z'),
      endAt: new Date('2023-10-01T12:00:00Z'),
      status: false,
    }

    const result = await controller.cancel(fakeUser, dto.id); 
    expect(mockService.delete).toHaveBeenCalledWith(fakeUser.sub, dto.id);
    expect(result.status).toBe(false);

  })

  it('should be able to find user history', async () => {
    const fakeUser: TAuthenticatedUser = { 
      sub: 'user123',
      role: 'USER',
    }

    const result = await controller.findUserHistory(fakeUser);
    expect(mockService.findAllByUser).toHaveBeenCalledWith(fakeUser.sub);
    expect(result).toEqual([fakeReservation,
    {
      userId: 'user234',
      roomId: 'room234',
      startAt: new Date('2025-10-01T10:00:00Z'),
      endAt: new Date('2025-10-01T12:00:00Z'),
      status: true,
    }]);
  })
})
