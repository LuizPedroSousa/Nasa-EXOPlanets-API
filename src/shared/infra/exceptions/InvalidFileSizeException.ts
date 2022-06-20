import { BaseException } from '@shared/domain/BaseException';

export class InvalidFileSizeException extends Error implements BaseException {
  constructor(fileName: string) {
    super(`File ${fileName} is too large`);
    this.name = 'InvalidFileSizeException';
  }
}
