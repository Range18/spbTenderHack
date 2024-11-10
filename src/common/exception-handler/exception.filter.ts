import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiException } from './api-exception';
import { Response } from 'express';
import { ExceptionResponse } from './exception-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof ApiException
        ? exception.status
        : exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof ApiException
        ? exception.message
        : exception instanceof HttpException
        ? exception.message
        : 'INTERNAL_SERVER_ERROR';

    const type = exception instanceof ApiException ? exception.type : undefined;

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log(exception);
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      type: type,
      message: message,
      output:
        statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? exception
          : exception instanceof HttpException
          ? exception.cause
          : undefined,
    } as ExceptionResponse);
  }
}
