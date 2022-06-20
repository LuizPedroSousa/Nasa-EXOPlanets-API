import { BaseException } from '@shared/domain/BaseException';

export class PlanetNotFoundException extends Error implements BaseException {
  constructor() {
    super('Planet not found');
    this.name = 'PlanetNotFoundException';
  }
}
