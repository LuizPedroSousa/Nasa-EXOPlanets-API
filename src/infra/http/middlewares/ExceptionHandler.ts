import { CorsOriginException } from '@shared/infra/exceptions/CorsOriginException';
import { InvalidFileExtensionException } from '@shared/infra/exceptions/InvalidFileExtensionException';
import { InvalidFileSizeException } from '@shared/infra/exceptions/InvalidFileSizeException';
import { Request, Response, NextFunction } from 'express';

class ExceptionHandler {
  public handle(
    exception: InvalidFileSizeException | InvalidFileExtensionException | CorsOriginException | Error,
    request: Request,
    response: Response,
    _: NextFunction,
  ): Response {
    const exceptions: any = {
      InvalidFileExtensionException: {
        statusCode: 400,
        message: exception.message,
      },
      InvalidFileSizeException: {
        statusCode: 400,
        message: exception.message,
      },
      CorsOriginException: {
        statusCode: 400,
        message: exception.message,
      },
    };

    const exceptionResponse = exceptions[exception.name];

    if (exceptionResponse) {
      return response.status(exceptionResponse.statusCode).json({
        message: exceptionResponse.message,
      });
    }

    console.error(exception);

    return response.status(500).json({
      status: 'error',
      message: 'Falha interna no servidor.',
    });
  }
}

export const exceptionHandler = new ExceptionHandler();
