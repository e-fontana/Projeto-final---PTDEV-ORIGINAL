import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Paramtype,
  PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

function validateWithZod<T>(schema: z.Schema<T>, value: unknown): T {
  const parse = schema.safeParse(value);

  if (!parse.success) {
    throw new BadRequestException({
      message: parse.error.message,
    });
  }

  return parse.data;
}

@Injectable()
export class ZodValidationPipe<T = any> implements PipeTransform {
  constructor(
    private schema: z.Schema<T>,
    private param: Paramtype = 'body',
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    if (this.param && metadata.type !== this.param) {
      return value as T;
    } else {
      const validatedValue = validateWithZod(this.schema, value);
      return validatedValue;
    }
  }
}
