import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TAuthenticatedUser } from 'src/auth/strategies/jwt-auth.strategy';
import { User } from 'src/common/decorators/user.decorator';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
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
  remove(@User() user: TAuthenticatedUser, @Param('id') id: string) {
    return this.reservationService.remove(user.sub, id);
  }

  @Get('/history')
  findUserHistory(@User() user: TAuthenticatedUser) {
    return this.reservationService.findUserHistory(user.sub);
  }
}
