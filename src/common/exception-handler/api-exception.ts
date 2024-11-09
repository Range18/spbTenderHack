import { HttpStatus } from '@nestjs/common';
import { AllExceptions } from '#src/common/exception-handler/exeption-types/all-exceptions';

const allExceptions = AllExceptions;

export type CustomExceptions = typeof allExceptions;

export type ExceptionType<T extends keyof CustomExceptions> =
  keyof CustomExceptions[T];

export type ExceptionMessage<T extends keyof CustomExceptions> =
  CustomExceptions[T][ExceptionType<T>];

export class ApiException<T extends keyof CustomExceptions> {
  readonly status: HttpStatus;
  readonly type: T;
  readonly message: ExceptionMessage<T>;
  constructor(status: HttpStatus, error: T, message: ExceptionMessage<T>) {
    this.status = status;
    this.type = error;
    this.message = message;
  }
}
