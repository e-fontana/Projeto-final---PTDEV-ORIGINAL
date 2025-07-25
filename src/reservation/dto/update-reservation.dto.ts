import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    id: string;
    userId: string;
    roomId: string;
    startAt: Date;
    endAt: Date;
    status: boolean;
}
