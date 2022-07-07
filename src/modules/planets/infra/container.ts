import { container } from 'tsyringe';
import { PlanetsRepository } from '../ports/PlanetsRepository';
import { InMemoryPlanetsRepository } from './repositories/InMemoryPlanetsRepository';

container.registerSingleton<PlanetsRepository>('PlanetsRepository', InMemoryPlanetsRepository);
