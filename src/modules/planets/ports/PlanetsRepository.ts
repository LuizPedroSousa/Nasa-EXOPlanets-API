import { Planet } from '@modules/planets/domains/Planet';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';
import { Either } from '@shared/either';
import { PlanetNotFoundException } from '../useCases/exceptions/PlanetNotFoundException';

interface PersistenceStellar {
  id: string;
  mass: string;
  effective_temperature: string;
  smet: string;
  radius: number;
  age: string;
}

export interface PersistencePlanet {
  id: string;
  name: string;
  telescope: string;
  habitable: boolean;
  disposition: string;
  stellar: PersistenceStellar;
  radius: number;
  insolation: number;
}

export interface PlanetsRepository {
  save(planet: Planet | Planet[]): Promise<Planet | Planet[]>;
  findByName(name: string): Promise<Either<PlanetNotFoundException, Planet>>;
  findById(id: UniqueIdentifier): Promise<Either<PlanetNotFoundException, Planet>>;
  findAll(where?: Partial<PersistencePlanet>): Promise<Planet[]>;
}
