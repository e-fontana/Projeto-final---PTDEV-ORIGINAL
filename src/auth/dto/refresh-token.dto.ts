import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import z from 'zod';

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const RefreshTokenValidationPipe = new ZodValidationPipe(
  refreshTokenSchema,
);
export type TRefreshTokenDto = z.infer<typeof refreshTokenSchema>;
