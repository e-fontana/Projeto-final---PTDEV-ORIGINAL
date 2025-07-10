import { Injectable } from '@nestjs/common';
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

  deleteReservationById(id: string) {
    return this.prismaService.reservation.delete({
      where: { id },
    });
  }
}
