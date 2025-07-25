import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  describe('AdminController', () => {
    let controller: AdminController;

    const mockReservations = [
      { id: 'abc123', name: 'Reservation 1' },
      { id: 'def456', name: 'Reservation 2' },
    ];

    const mockAdminService = {
      getAllReservations: jest.fn().mockResolvedValue(mockReservations),
      deleteReservationById: jest.fn().mockResolvedValue({ deleted: true }),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [AdminController],
        providers: [{ provide: AdminService, useValue: mockAdminService }],
      }).compile();

      controller = module.get<AdminController>(AdminController);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('getAllReservations', () => {
      it('should return all reservations', async () => {
        const result = await controller.getAllReservations();
        expect(mockAdminService.getAllReservations).toHaveBeenCalled();
        expect(result).toEqual(mockReservations);
      });
    });

    describe('deleteReservationById', () => {
      it('should delete reservation by id', async () => {
        const id = 'abc123';
        const result = await controller.deleteReservationById(id);
        expect(mockAdminService.deleteReservationById).toHaveBeenCalledWith(id);
        expect(result).toEqual({ deleted: true });
      });
    });
  });
});
