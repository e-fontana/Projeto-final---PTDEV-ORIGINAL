import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, createReservationDto: CreateReservationDto) {
    const reservationExists = await this.prismaService.reservation.findFirst({
      where: {
        userId,
        roomId: createReservationDto.roomId,
        startAt: createReservationDto.startAt,
        endAt: createReservationDto.endAt,
      },
    });

    if (reservationExists) {
      throw new BadRequestException('Reservation already exists');
    }

    const reservationConflict = await this.prismaService.reservation.findFirst({
      where: {
        roomId: createReservationDto.roomId,
        startAt: { lt: createReservationDto.endAt },
        endAt: { gt: createReservationDto.startAt },
      },
    });

    if (reservationConflict) {
      throw new BadRequestException('reservation with conflicting time');
    }

    const createReservation = await this.prismaService.reservation.create({
      data: {
        ...createReservationDto,
        userId,
      },
    });

    return createReservation;
  }

  async findAllByUser(userId: string) {
    const allReservations = await this.prismaService.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!allReservations) {
      throw new NotFoundException('No reservations found for this user');
    }

    return allReservations;
  }

  async findOne(userId: string, id: string) {
    const reservation = await this.prismaService.reservation.findFirst({
      where: {
        userId,
        id,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async delete(userId: string, id: string) {
    const reservation = await this.prismaService.reservation.findFirst({
      where: {
        userId,
        id,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return this.prismaService.reservation.delete({
      where: {
        id,
      },
    });
  }

  async cancel(userId: string, id: string) {
    const reservationExists = await this.prismaService.reservation.findFirst({
      where: {
        id: id,
        userId,
      },
    });

    if (!reservationExists) {
      throw new NotFoundException('Reservation not found');
    }

    if (
      new Date(reservationExists.startAt) <
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    ) {
      throw new BadRequestException(
        'You can only cancel reservations at least 24 hours in advance',
      );
    }

    return this.prismaService.reservation.update({
      where: {
        id: id,
      },
      data: {
        status: false,
      },
    });
  }

  async findUserHistory(userId: string) {
    const allReservations = await this.prismaService.reservation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (allReservations.length === 0) {
      throw new NotFoundException('No reservations found for this user');
    }

    return allReservations;
  }
}
