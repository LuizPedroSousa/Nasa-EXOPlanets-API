import { Planet } from '@modules/planets/domains/Planet';
import { ListPlanetsDTO } from '@modules/planets/useCases/dtos/ListPlanetsDTO';
import { ListPlanetsUseCase } from '@modules/planets/useCases/ListPlanetsUseCase';
import { UseCase } from '@shared/domain/UseCase';
import { BaseController } from '@shared/infra/BaseController';
import { HttpResponse } from '@shared/infra/HttpResponse';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListPlanetsController extends BaseController {
  constructor(
    @inject(ListPlanetsUseCase)
    private listPlanetsUseCase: UseCase<ListPlanetsDTO, Planet[]>,
  ) {
    super();
  }

  protected async handle(): Promise<HttpResponse> {
    const { query } = this.req;

    const planets = await this.listPlanetsUseCase.execute({ ...query });

    return this.ok({
      planets: planets.map(planet => planet.toJSON()),
    });
  }
}
