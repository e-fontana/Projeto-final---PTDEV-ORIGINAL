import * as dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});

const validateEnv = envSchema.safeParse(process.env);

if (!validateEnv.success) {
  console.error('Invalid environment variables:', validateEnv.error.message);
  process.exit(1);
}

export const env = validateEnv.data;
