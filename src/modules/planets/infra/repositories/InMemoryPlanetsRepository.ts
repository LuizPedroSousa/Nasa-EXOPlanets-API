import { Planet } from '@modules/planets/domains/Planet';
import { PlanetMapper } from '@modules/planets/mappers/PlanetMapper';
import { PersistencePlanet, PlanetsRepository } from '@modules/planets/ports/PlanetsRepository';
import { PlanetNotFoundException } from '@modules/planets/useCases/exceptions/PlanetNotFoundException';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';

export class InMemoryPlanetsRepository implements PlanetsRepository {
  private planets: PersistencePlanet[] = [];

  async findAll(where: Partial<PersistencePlanet> = {}): Promise<Planet[]> {
    const planetsPersistence = this.planets.filter(InMemoryPlanetsRepository.whereFilter(where));

    const planets = planetsPersistence.map(PlanetMapper.toDomain);

    return planets;
  }

  async findById(id: UniqueIdentifier): Promise<Either<PlanetNotFoundException, Planet>> {
    const planet = this.planets.find(planet => id.equals(new UniqueIdentifier(planet.id)));

    if (!planet) {
      return left(new PlanetNotFoundException());
    }

    return right(PlanetMapper.toDomain(planet));
  }

  async findByName(name: string): Promise<Either<PlanetNotFoundException, Planet>> {
    const planet = this.planets.find(planet => planet.name === name);

    if (!planet) {
      return left(new PlanetNotFoundException());
    }

    return right(PlanetMapper.toDomain(planet));
  }

  async save(planet: Planet | Planet[]): Promise<Planet | Planet[]> {
    if (Array.isArray(planet)) {
      const planetsPersistence = planet.map(PlanetMapper.toPersistence);
      this.planets.push(...planetsPersistence);
    } else {
      this.planets.push(PlanetMapper.toPersistence(planet));
    }

    return planet;
  }

  private static whereFilter(where: Partial<PersistencePlanet> = {}): (planet: PersistencePlanet) => boolean {
    return planet => {
      return Object.keys(where).every(key => {
        // @ts-ignore

        return planet[key] === where[key];
      });
    };
  }
}
