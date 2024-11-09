import { HttpStatus } from '@nestjs/common';

export class ExceptionResponse {
  statusCode: HttpStatus;
  type?: string;
  message: string;
  output?: string;
}
