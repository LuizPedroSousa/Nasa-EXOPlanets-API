import { left, right } from '@shared/either';
import { InvalidPlanetDispositionException } from './exceptions/InvalidPlanetDispositionException';
import { PlanetDisposition } from './PlanetDisposition';

describe('[UNIT] - [Planets] - PlanetDisposition ValueObject', () => {
  it('should be able return PlanetDisposition, when disposition is confirmed', () => {
    const planetDispositionOrError = PlanetDisposition.create('CONFIRMED');

    expect(planetDispositionOrError.isLeft()).toBeFalsy();

    const planet = planetDispositionOrError.value;

    expect(planet).toEqual({ props: { value: 'CONFIRMED' } });
  });

  it('should be able return true, when disposition is valid', () => {
    expect(PlanetDisposition.validate('FALSE POSITIVE')).toBe(true);
    expect(PlanetDisposition.validate('CANDIDATE')).toBe(true);
    expect(PlanetDisposition.validate('NOT DISPOSITIONED')).toBe(true);
    expect(PlanetDisposition.validate('CONFIRMED')).toBe(true);
  });

  it('should give an InvalidPlaneDispositionException, when disposition is invalid', () => {
    const planetDispositionOrError = PlanetDisposition.create('INVALID');

    expect(planetDispositionOrError.isRight()).toBeFalsy();
    expect(planetDispositionOrError).toEqual(left(new InvalidPlanetDispositionException('INVALID')));
  });
});
