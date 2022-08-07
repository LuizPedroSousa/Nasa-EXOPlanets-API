import { injectable, inject } from 'tsyringe';
import { Planet } from '../domains/Planet';
import { PlanetsRepository } from '../ports/PlanetsRepository';

import { UseCase } from '@shared/domain/UseCase';

import { ListPlanetsDTO } from './dtos/ListPlanetsDTO';

@injectable()
export class ListPlanetsUseCase implements UseCase<ListPlanetsDTO, Planet[]> {
  constructor(
    @inject('PlanetsRepository')
    private planetsRepository: PlanetsRepository,
  ) {}

  async execute(data: ListPlanetsDTO) {
    const planetsExists = await this.planetsRepository.findAll(data);

    return planetsExists;
  }
}
