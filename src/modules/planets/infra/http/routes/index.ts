import { Router } from 'express';
import { keplerRouter } from './container/kepler.routes';
import { planetsRouter } from './container/planets.routes';

const planetRoutes = Router();

planetRoutes.use('/', planetsRouter);
planetRoutes.use('/kepler', keplerRouter);

export { planetRoutes };
