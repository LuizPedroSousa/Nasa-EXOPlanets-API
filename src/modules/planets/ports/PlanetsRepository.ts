import { Planet, PlanetProps } from '@modules/planets/domains/Planet';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either } from '@shared/either';
import { PlanetNotFoundException } from '../useCases/exceptions/PlanetNotFoundException';

export interface PlanetsRepository {
  save(planet: Planet | Planet[]): Promise<Planet | Planet[]>;
  findByName(name: string): Promise<Either<PlanetNotFoundException, Planet>>;
  findById(id: UniqueIdentifier): Promise<Either<PlanetNotFoundException, Planet>>;
  findAll(where?: Partial<PlanetProps>): Promise<Planet[]>;
}
