import { Request, Response } from 'express';

interface JSONResponseDTO {
  status: number;
  message?: string;
  data?: any;
}

export abstract class BaseController {
  protected req: Request;
  protected res: Response;

  protected abstract handle(): Promise<void | any>;

  public async execute(req: Request, res: Response): Promise<void | any> {
    this.req = req;
    this.res = res;
    return this.handle();
  }

  public jsonResponse({ status, message, data }: JSONResponseDTO): Response {
    return this.res.status(status).json({ message, data });
  }

  public ok(data?: any): Response {
    return this.jsonResponse({ message: 'OK', status: 200, data });
  }

  public created(data?: any): Response {
    return this.jsonResponse({ message: 'Created', status: 201, data });
  }

  public noContent(): Response {
    return this.jsonResponse({ status: 204 });
  }

  public badRequest(message?: string): Response {
    return this.jsonResponse({ message: message || 'Bad Request', status: 400 });
  }

  public unauthorized(message?: string): Response {
    return this.jsonResponse({ message: message || 'Unauthorized', status: 401 });
  }

  public forbidden(message?: string): Response {
    return this.jsonResponse({ message: message || 'Forbidden', status: 403 });
  }

  public notFound(message?: string): Response {
    return this.jsonResponse({ message: message || 'Not Found', status: 404 });
  }

  public tooMany(message?: string): Response {
    return this.jsonResponse({ message: message || 'Too Many Requests', status: 429 });
  }

  public fail(message?: string): Response {
    return this.jsonResponse({ message: message || 'Internal Server Error', status: 500 });
  }

  public badGateway(message?: string): Response {
    return this.jsonResponse({ message: message || 'Bad Gateway', status: 502 });
  }
}
