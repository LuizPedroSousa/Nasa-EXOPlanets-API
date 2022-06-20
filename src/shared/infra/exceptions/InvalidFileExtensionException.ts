import { BaseException } from '@shared/domain/BaseException';

export class InvalidFileExtensionException extends Error implements BaseException {
  constructor(extension: string) {
    super(`Invalid file extension: ${extension}`);
    this.name = 'InvalidFileExtensionException';
  }
}
