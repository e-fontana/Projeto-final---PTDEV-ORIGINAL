import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string({ required_error: 'Username is required' })
    .min(4, { message: 'Username must be at least 4 characters' })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: 'Username must be a valid email address',
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
});
export class RegisterUserDto extends createZodDto(registerUserSchema) {}
export type TRegisterUser = z.infer<typeof registerUserSchema>;
