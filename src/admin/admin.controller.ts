import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decorator';
import { ParseNanoIdPipe } from 'src/common/pipes/nanoid.pipe';
import { AdminService } from './admin.service';

@Roles('ADMIN')
@Controller('/admin')
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
}
