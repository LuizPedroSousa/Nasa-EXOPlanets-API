import { BaseException } from '@shared/domain/BaseException';

export class MissingParamsException extends Error implements BaseException {
  constructor(fields: string[]) {
    super(`Missing params: ${fields.join(', ')}`);

    this.name = 'MissingParamsException';
  }
}
