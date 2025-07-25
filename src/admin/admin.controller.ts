import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ParseNanoIdPipe } from 'src/common/pipes/nanoid.pipe';
import { AdminService } from './admin.service';

@Roles('ADMIN')
@Controller('/admin')
@ApiBearerAuth('access_token')
@ApiTags('Administração')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/reservations')
  getAllReservations() {
    return this.adminService.getAllReservations();
  }

  @Delete('/reservations/:id')
  deleteReservationById(@Param('id', new ParseNanoIdPipe()) id: string) {
    return this.adminService.deleteReservationById(id);
  }

  @Delete('/users/:id')
  deleteUserById(@Param('id', new ParseNanoIdPipe()) id: string) {
    return this.adminService.deleteUser(id);
  }
}
