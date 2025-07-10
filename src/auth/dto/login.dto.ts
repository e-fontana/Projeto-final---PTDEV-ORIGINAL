import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import z from 'zod';

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8, 'A senha deve possuir pelo menos 8 caracteres'),
});

export const LoginValidationPipe = new ZodValidationPipe(loginSchema);
export type TLoginDto = z.infer<typeof loginSchema>;
