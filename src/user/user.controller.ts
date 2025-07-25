import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { TAuthenticatedUser } from '../auth/strategies/jwt-auth.strategy';
import { Roles } from '../common/decorators/role.decorator';
import { User } from '../common/decorators/user.decorator';
import {
  TUpdateUserDto,
  UpdateUserValidationPipe,
} from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TRegisterUser } from 'src/auth/dto/register.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post() 
  async create(@Body() createUserDto: CreateUserDto) {
      return this.service.create(createUserDto);
    }

  @Get('me')
  async getMeById(@User() user: TAuthenticatedUser) {
    return this.service.findById(user.sub);
  }

  @Get('me/email')
  async getMeByEmail(@Body () data: TRegisterUser) {
    return this.service.findByEmail(data.email); //PERGUNTAR A FONTANA, PQ MEXE NO AUTH
  }

  @Put('me')
  @UsePipes(UpdateUserValidationPipe) //SÓ DÁ UPDATE NO NAME???
  async updateMe(
    @User() user: TAuthenticatedUser,
    @Body() updateUserDto: TUpdateUserDto,
  ) {
    return this.service.update(user.sub, updateUserDto);
  }

  @Delete(':id')
  @Roles('ADMIN') // DEU UNAUTHORIZED
  deleteUser(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

