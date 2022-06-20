import { planetRoutes } from '@modules/planets/infra/http/routes';
import { Router } from 'express';

const routes = Router();

routes.use('/planets', planetRoutes);

export { routes };
