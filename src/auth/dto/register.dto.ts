import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class AuthRegisterDto {
  @ApiProperty({
    example: 'TITAN DA POLI',
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({
    example: 'icarolindo@titanci.com.br',
  })
  @IsEmail({}, { message: 'Username must be a valid e-mail' })
  username: string;

  @ApiProperty({
    example: 'TIT@Ndapoli2019',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;
}
