import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LoginValidationPipe, TLoginDto } from './dto/login.dto';
import {
  RefreshTokenValidationPipe,
  TRefreshTokenDto,
} from './dto/refresh-token.dto';
import { RegisterUserDto, TRegisterUser } from './dto/register.dto';
import { TAuthenticatedUser } from './strategies/jwt-auth.strategy';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  @ApiBody({ type: RegisterUserDto })
  @ApiOperation({ summary: 'Register a new user' })
  create(@Body() createAuthDto: TRegisterUser) {
    return this.authService.register(createAuthDto);
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(LoginValidationPipe)
  async login(@Body() loginDto: TLoginDto) {
    const { access_token, refresh_token } =
      await this.authService.login(loginDto);

    return {
      access_token,
      refresh_token,
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UsePipes(RefreshTokenValidationPipe)
  logout(
    @User() user: TAuthenticatedUser,
    @Body() refreshTokenDto: TRefreshTokenDto,
  ) {
    return this.authService.logout(user.sub, refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(RefreshTokenValidationPipe)
  refresh(@Body() refreshTokenDto: TRefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('/forgot-passord/:email')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body('email') email: string) {
    console.log(email);
    throw new NotImplementedException();
  }

  @Public()
  @Post('/reset-passord')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Query('token') token: string) {
    console.log(token);
    throw new NotImplementedException();
  }
}
