import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRoomDTO {
    @ApiProperty({
        example: 'Updated room name',
        required: false
    })
    @IsString({ message: 'Name must be a string' })
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 5,
        required: false
    })
    @IsNumber()
    @IsInt({ message: 'Max Capacity must be an integer' })
    @IsOptional()
    @Min(1, { message: 'Max Capacity must be greater than 0' })
    maxCapacity?: number;

    @ApiProperty({
        example: 'Updated room description',
        required: false
    })
    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
