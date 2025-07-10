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
import {
  TUpdateUserDto,
  UpdateUserValidationPipe,
} from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  async getMe(@User() user: TAuthenticatedUser) {
    return this.service.findById(user.sub);
  }

  @Put('me')
  @UsePipes(UpdateUserValidationPipe)
  async updateMe(
    @User() user: TAuthenticatedUser,
    @Body() updateUserDto: TUpdateUserDto,
  ) {
    return this.service.update(user.sub, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteUser(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }
}
