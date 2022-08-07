import { left } from '@shared/either';
import { PlanetsBuild } from './builds/PlanetsBuild';
import { InvalidPlanetDispositionException } from './exceptions/InvalidPlanetDispositionException';
import { Planet } from './Planet';

describe('[UNIT] - [Planets] - Planet Entity', () => {
  it('should be able to create a Planet, when credentials are valid', () => {
    const data = PlanetsBuild.generate();
    const planetOrError = Planet.create(data);

    expect(planetOrError.isLeft()).toBeFalsy();
    expect(planetOrError.value).toBeInstanceOf(Planet);

    const planet = planetOrError.value as Planet;

    expect(planet.id).toBeDefined();
    expect(planet.props).toEqual(
      expect.objectContaining({
        ...data,
        disposition: {
          props: {
            value: data.disposition,
          },
        },
      }),
    );
  });

  it('should give an InvalidPlanetDispositionException, when disposition is in valid', () => {
    const planetOrError = Planet.create(PlanetsBuild.generate({ disposition: 'INVALID' }));

    expect(planetOrError.isRight()).toBeFalsy();
    expect(planetOrError.value).toBeInstanceOf(InvalidPlanetDispositionException);
    expect(planetOrError).toEqual(left(new InvalidPlanetDispositionException('INVALID')));
  });
});
