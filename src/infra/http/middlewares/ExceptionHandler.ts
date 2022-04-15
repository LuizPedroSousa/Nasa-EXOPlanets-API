import { Request, Response, NextFunction } from "express";

class ExceptionHandler {
  public handle(
    exception: Error,
    request: Request,
    response: Response,
    _: NextFunction
  ): Response {
    console.error(exception);

    return response.status(500).json({
      status: "error",
      message: "Falha interna no servidor.",
    });
  }
}

export const exceptionHandler = new ExceptionHandler();
