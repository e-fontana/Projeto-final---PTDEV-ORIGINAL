import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseNanoIdPipe implements PipeTransform {
  constructor(private readonly expectedLength: number = 21) {}

  transform(value: any) {
    const nanoidRegex = /^[a-zA-Z0-9_-]+$/;
    if (
      typeof value !== 'string' ||
      value.length !== this.expectedLength ||
      !nanoidRegex.test(value)
    ) {
      throw new BadRequestException(
        `Validation failed: value must be a NanoID with length ${this.expectedLength}`,
      );
    }
    return value;
  }
}
