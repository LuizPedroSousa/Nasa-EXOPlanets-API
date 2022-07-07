import { Planet, PlanetProps } from '@modules/planets/domains/Planet';
import { PlanetNotFoundException } from '@modules/planets/useCases/exceptions/PlanetNotFoundException';
import { PlanetsRepository } from '@modules/planets/ports/PlanetsRepository';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either, left, right } from '@shared/either';

export class InMemoryPlanetsRepository implements PlanetsRepository {
  private planets: Planet[] = [];

  async findAll(where: Partial<PlanetProps> = {}): Promise<Planet[]> {
    const planets = this.planets.filter(InMemoryPlanetsRepository.whereFilter(where));

    return planets;
  }

  async findById(id: UniqueIdentifier): Promise<Either<PlanetNotFoundException, Planet>> {
    const planet = this.planets.find(planet => planet.id.equals(id));

    if (!planet) {
      return left(new PlanetNotFoundException());
    }

    return right(planet);
  }

  async findByName(name: string): Promise<Either<PlanetNotFoundException, Planet>> {
    const planet = this.planets.find(planet => planet.props.name === name);

    if (!planet) {
      return left(new PlanetNotFoundException());
    }

    return right(planet);
  }

  async save(planet: Planet | Planet[]): Promise<Planet | Planet[]> {
    if (Array.isArray(planet)) {
      this.planets.push(...planet);
    } else {
      this.planets.push(planet);
    }

    return planet;
  }

  private static whereFilter(where: Partial<PlanetProps> = {}): (planet: Planet) => boolean {
    return planet => {
      return Object.keys(where).every(key => {
        // @ts-ignore

        return planet.props[key] === where[key];
      });
    };
  }
}
