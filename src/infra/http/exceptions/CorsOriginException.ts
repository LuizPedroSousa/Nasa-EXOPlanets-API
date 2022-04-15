import { BaseException } from '@shared/domain/BaseException';

export class CorsOriginException extends Error implements BaseException {
  constructor(origin: string) {
    super(`A política CORS para este site não permite acesso da Origem ${origin}.`);

    this.name = 'CorsOriginException';
  }
}
