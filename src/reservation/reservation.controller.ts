import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TAuthenticatedUser } from 'src/auth/strategies/jwt-auth.strategy';
import { Roles } from 'src/common/decorators/role.decorator';
import { User } from '../common/decorators/user.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';

@Roles('USER')
@ApiBearerAuth('access_token')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @User() user: TAuthenticatedUser,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(user.sub, createReservationDto);
  }

  @Get()
  findAll(@User() user: TAuthenticatedUser) {
    return this.reservationService.findAllByUser(user.sub);
  }

  @Get(':id')
  findOne(@User() user: TAuthenticatedUser, @Param('id') id: string) {
    return this.reservationService.findOne(user.sub, id);
  }

  @Delete(':id')
  delete(@User() user: TAuthenticatedUser, @Param('id') id: string) {
    return this.reservationService.delete(user.sub, id);
  }

  @Patch(':id')
  cancel(@User() user: TAuthenticatedUser, @Param('id') id: string) {
    return this.reservationService.cancel(user.sub, id);
  }

  @Get('/history')
  findUserHistory(@User() user: TAuthenticatedUser) {
    return this.reservationService.findUserHistory(user.sub);
  }
}
