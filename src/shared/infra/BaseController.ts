import { HttpResponse } from './HttpResponse';
import { HttpRequest } from './HttpRequest';

interface JSONResponseDTO {
  status: number;
  message?: string;
  data?: any;
}

export abstract class BaseController {
  protected req: HttpRequest;
  protected res: HttpResponse;

  protected abstract handle(request?: HttpRequest): Promise<HttpResponse | void>;

  public async execute(req: HttpRequest): Promise<void | any> {
    this.req = req;
    return this.handle(this.req);
  }

  public jsonResponse({ message, status, data }: JSONResponseDTO): HttpResponse {
    return {
      status,
      body: {
        message,
        ...data,
      },
    };
  }

  public ok(data?: any): HttpResponse {
    return this.jsonResponse({ message: 'OK', status: 200, data });
  }

  public created(data?: any): HttpResponse {
    return this.jsonResponse({ message: 'Created', status: 201, data });
  }

  public noContent(): HttpResponse {
    return this.jsonResponse({ status: 204 });
  }

  public badRequest(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Bad Request', status: 400 });
  }

  public unauthorized(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Unauthorized', status: 401 });
  }

  public forbidden(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Forbidden', status: 403 });
  }

  public notFound(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Not Found', status: 404 });
  }

  public tooMany(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Too Many Requests', status: 429 });
  }

  public fail(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Internal Server Error', status: 500 });
  }

  public badGateway(message?: string): HttpResponse {
    return this.jsonResponse({ message: message || 'Bad Gateway', status: 502 });
  }
}
