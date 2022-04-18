import { BaseException } from '@shared/domain/BaseException';

export class InvalidPlanetDispositionException extends Error implements BaseException {
  constructor(disposition: string) {
    super(`${disposition} is not a valid planet disposition`);
  }
}
