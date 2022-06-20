import { container } from 'tsyringe';
import { PlanetsRepository } from '../useCases/ports/PlanetsRepository';
import { InMemoryPlanetsRepository } from './repositories/InMemoryPlanetsRepository';

container.registerSingleton<PlanetsRepository>('PlanetsRepository', InMemoryPlanetsRepository);
