import { Router } from 'express';
import { ImportKeplerPlanetsController } from '../../controlers/kepler/ImportKeplerPlanetsController';
import { container } from 'tsyringe';
import { routeAdapter } from '@infra/http/adapters/routeAdapter';
import { ensureUpload } from '@infra/http/middlewares/EnsureUpload';

const importKeplerPlanetsController = container.resolve(ImportKeplerPlanetsController);

const keplerRouter = Router();

keplerRouter.post(
  '/import',
  ensureUpload.handle({ file: 'planets', extensions: ['csv'] }),
  routeAdapter(importKeplerPlanetsController),
);

export { keplerRouter };
