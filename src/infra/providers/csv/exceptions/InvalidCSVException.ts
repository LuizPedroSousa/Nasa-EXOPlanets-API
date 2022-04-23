import { BaseException } from '@shared/domain/BaseException';

export class InvalidCSVException extends Error implements BaseException {
  constructor() {
    super('Invalid CSV');
    this.name = 'InvalidCSVException';
  }
}
