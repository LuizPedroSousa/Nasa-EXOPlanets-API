import { ImportKeplerPlanetsDTO } from '@modules/planets/useCases/dtos/ImportKeplerPlanetsDTO';
import { ImportKeplerPlanetsUseCase } from '@modules/planets/useCases/kepler/ImportKeplerPlanetsUseCase';
import { ImportKeplerPlanetsResponse } from '@modules/planets/useCases/responses/ImportKeplerPlanetsResponse';
import { BaseException } from '@shared/domain/BaseException';
import { UseCase } from '@shared/domain/UseCase';
import { BaseController } from '@shared/infra/BaseController';
import { MissingParamsException } from '@shared/infra/exceptions/MissingParamsException';
import { HttpResponse } from '@shared/infra/HttpResponse';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ImportKeplerPlanetsController extends BaseController {
  constructor(
    @inject(ImportKeplerPlanetsUseCase)
    private useCase: UseCase<ImportKeplerPlanetsDTO, ImportKeplerPlanetsResponse>,
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
      return this.getException(planetsOrError.value);
    }

    return this.created({
      planets: planetsOrError.value.map(planet => planet.toJSON()),
    });
  }

  private getException(exception: BaseException) {
    const errors: any = {
      InvalidPlanetDispositionException: this.badRequest(exception.message),
      InvalidCSVException: this.badRequest(exception.message),
    };

    const handler = errors[exception.name];

    if (!handler) {
      return this.fail();
    }

    return handler;
  }
}
