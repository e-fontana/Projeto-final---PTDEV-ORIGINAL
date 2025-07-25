import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  getAllReservations() {
    return this.prismaService.reservation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteReservationById(id: string) {
    try {
      await this.prismaService.reservation.delete({ where: { id } });
      return { message: 'Reservation deleted successfully' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Invalid reservation ID');
      }

      throw new Error(`Failed to delete reservation with id ${id}`);
    }
  }

  deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
