import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  const mockReservations = [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') },
  ];

  const prismaServiceMock = {
    reservation: {
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllReservations', () => {
    it('should return all reservations ordered by createdAt desc', async () => {
      prismaServiceMock.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.getAllReservations();

      expect(prismaServiceMock.reservation.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toBe(mockReservations);
    });
  });

  describe('deleteReservationById', () => {
    it('should delete reservation by id and return the deleted reservation', async () => {
      const deletedReservation = { id: '1', createdAt: new Date() };
      prismaServiceMock.reservation.delete.mockResolvedValue(
        deletedReservation,
      );

      const result = await service.deleteReservationById('1');

      expect(prismaServiceMock.reservation.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toStrictEqual({ message: 'Reservation deleted successfully' });
    });

    it('should throw BadRequestException if PrismaClientKnownRequestError is thrown', async () => {
      const error = new PrismaClientKnownRequestError('Invalid reservation ID', {
        code: 'P2000',
        clientVersion: '4.17.0',
      });

      prismaServiceMock.reservation.delete.mockImplementation(() => {
        throw error;
      });

      await expect(service.deleteReservationById('1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.deleteReservationById('1')).rejects.toThrow(
        'Invalid reservation ID',
      );
    });

    it('should throw generic Error for other errors', async () => {
      const error = new Error('Some other error');

      prismaServiceMock.reservation.delete.mockImplementation(() => {
        throw error;
      });

      await expect(service.deleteReservationById('1')).rejects.toThrow(Error);
      await expect(service.deleteReservationById('1')).rejects.toThrow(
        'Failed to delete reservation with id 1',
      );
    });
  });
});
