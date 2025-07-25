import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRoomDTO {
    @ApiProperty({
        example: 'Room name'
    })
    @IsString({message: 'Name must be a string'})
    @IsNotEmpty({message: 'Name is required'})
    name: string;

    @ApiProperty({
        example: 5
    })
    @IsNumber()
    @IsInt({message: 'Max Capacity must be an integer'})
    @IsNotEmpty({message: 'Max Capacity is required'})
    @Min(1, {message: 'Max Capacity must be greater than 0'})
    maxCapacity: number

    @ApiProperty({
        example: 'Room description'
    })
    @IsNotEmpty({message: 'Description is required'})
    @IsString({message: 'Description must be a string'})
    description: string

    @ApiProperty({
        example: true
    })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean = true
}