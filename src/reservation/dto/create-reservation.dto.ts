import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateReservationDto {

    @ApiProperty({
        example: 'room123'
    })
    @IsNotEmpty({
        message: 'Room id is required'
    })
    roomId: string;

    @ApiProperty({
        example: '2030-10-01T10:00:00Z'
    })
    @IsNotEmpty({
        message: 'StartedAt is required'
    })
    startAt: Date;

    @ApiProperty({
        example: '2030-10-01T12:00:00Z'
    })
    @IsNotEmpty({
        message: 'EndAt is required'
    })
    endAt: Date;
    
    @ApiProperty({
        example: true
    })
    @IsNotEmpty({
        message: 'Status id is required'
    })
    status: boolean;
}
