import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import z from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const UpdateUserValidationPipe = new ZodValidationPipe(updateUserSchema);
export type TUpdateUserDto = z.infer<typeof updateUserSchema>;
