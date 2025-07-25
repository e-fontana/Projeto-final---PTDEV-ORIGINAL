import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common';
import { TAuthenticatedUser } from 'src/auth/strategies/jwt-auth.strategy';
import { Roles } from 'src/common/decorators/role.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  async getMe(@User() user: TAuthenticatedUser) {
    return this.service.findById(user.sub);
  }

  @Put('me')
  @UsePipes(UpdateUserDto)
  async updateMe(
    @User() user: TAuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.service.update(user.sub, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
