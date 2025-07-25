import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../common/decorators/role.decorator';
import { RoomService } from './room.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoomValidationPipe, TCreateRoom } from './dto/create-room.dto';
import { TUpdateRoom, UpdateRoomValidationPipe } from './dto/update-room.dto';

@ApiTags('room')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body(CreateRoomValidationPipe) createRoomDto: TCreateRoom) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body(UpdateRoomValidationPipe) updateRoomDto: TUpdateRoom) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.roomService.updateStatus(id, { isActive });
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}