import { ImportKeplerPlanetsUseCase } from '@modules/planets/useCases/kepler/ImportKeplerPlanetsUseCase';
import { BaseController } from '@shared/infra/BaseController';
import { MissingParamsException } from '@shared/infra/exceptions/MissingParamsException';
import { HttpResponse } from '@shared/infra/HttpResponse';

import { injectable, inject } from 'tsyringe';

@injectable()
export class ImportKeplerPlanetsController extends BaseController {
  constructor(
    @inject(ImportKeplerPlanetsUseCase)
    private useCase: ImportKeplerPlanetsUseCase,
  ) {
    super();
  }

  protected async handle(): Promise<HttpResponse> {
    const { file } = this.req;

    if (!file || !file?.filename) {
      return this.badRequest(new MissingParamsException(['planets']).message);
    }

    const planetsOrError = await this.useCase.execute({
      file_identifier: file?.filename,
    });

    if (planetsOrError.isLeft()) {
      const errors: any = {
        InvalidPlanetDispositionException: this.badRequest(planetsOrError.value.message),
        InvalidCSVException: this.badRequest(planetsOrError.value.message),
      };

      const exception = planetsOrError.value;

      const handler = errors[exception.name];

      if (!handler) {
        return this.fail();
      }

      return handler;
    }

    return this.created({
      planets: planetsOrError.value.map(planet => planet.toJSON()),
    });
  }
}
