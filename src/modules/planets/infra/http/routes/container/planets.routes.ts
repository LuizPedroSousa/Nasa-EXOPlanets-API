import { routeAdapter } from '@infra/http/adapters/routeAdapter';
import { Router } from 'express';
import { container } from 'tsyringe';
import { ListPlanetsController } from '../../controlers/ListPlanetsController';

const listPlanetsController = container.resolve(ListPlanetsController);

const planetsRouter = Router();

planetsRouter.get('/', routeAdapter(listPlanetsController));

export { planetsRouter };
