import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, createReservationDto: CreateReservationDto) {
    return 'This action adds a new reservation';
  }

  findAllByUser(userId: string) {
    return `This action returns all reservation`;
  }

  findOne(userId: string, id: string) {
    return `This action returns a #${id} reservation`;
  }

  remove(userId: string, id: string) {
    return `This action removes a #${id} reservation`;
  }

  findUserHistory(userId: string) {
    return this.prismaService.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
