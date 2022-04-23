import { Router } from 'express';
import { keplerRouter } from './container/kepler.routes';

const planetRoutes = Router();

planetRoutes.use('/kepler', keplerRouter);

export { planetRoutes };
