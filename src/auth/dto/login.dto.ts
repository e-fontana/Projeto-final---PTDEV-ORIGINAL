import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    example: 'contato@titanci.com.br',
  })
  @IsEmail({}, { message: 'Username must be a valid e-mail' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'TIT@Ndapoli2019',
  })
  password: string;
}
