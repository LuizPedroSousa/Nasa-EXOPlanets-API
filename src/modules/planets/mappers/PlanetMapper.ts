import { Stellar } from '@modules/stellars/Stellar';
import { Mapper } from '@shared/domain/Mapper';
import { Planet } from '../domains/Planet';
import { PlanetDisposition } from '../domains/PlanetDisposition';
import { PlanetHabitable } from '../domains/PlanetHabitable';
import { PersistencePlanet } from '../ports/PlanetsRepository';

export class PlanetMapper extends Mapper<Planet, PersistencePlanet> {
  static toDomain(data: PersistencePlanet): Planet {
    return Planet.save({
      ...data,
      disposition: PlanetDisposition.save(data.disposition),
      habitable: PlanetHabitable.save(data.habitable),
      stellar: Stellar.save(data.stellar),
    });
  }

  static toPersistence(planet: Planet): PersistencePlanet {
    return {
      id: planet.id.getValue(),
      ...planet.props,
      disposition: planet.disposition,
      habitable: planet.habitable,
      stellar: {
        id: planet.stellar.id.getValue(),
        ...planet.stellar.props,
      },
    };
  }
}
