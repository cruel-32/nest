import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorHandleFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('exception ::::: ', exception);
    console.log('host ::::: ', host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const http =
      exception instanceof HttpException
        ? {
            statusCode: exception.getStatus(),
            message: exception.getStatus(),
            response: exception.getResponse(),
          }
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      exception,
      http,
    });
  }
}
