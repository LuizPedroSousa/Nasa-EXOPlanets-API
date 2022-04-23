import { CsvParserProvider } from '@infra/providers/csv/ports/CsvParserProvider';
import { Planet } from '@modules/planets/domains/Planet';
import { Stellar } from '@modules/stellars/Stellar';
import { UseCase } from '@shared/domain/UseCase';
import { left, right } from '@shared/either';
import { injectable, inject } from 'tsyringe';
import { ImportKeplerPlanetsDTO } from '../dtos/ImportKeplerPlanetsDTO';
import { PlanetsRepository } from '../ports/PlanetsRepository';
import { ImportKeplerPlanetsResponse } from '../responses/ImportKeplerPlanetsResponse';

@injectable()
export class ImportKeplerPlanetsUseCase implements UseCase<ImportKeplerPlanetsDTO, ImportKeplerPlanetsResponse> {
  constructor(
    @inject('PlanetsRepository')
    private planetRepository: PlanetsRepository,
    @inject('CsvParserProvider')
    private csvParserProvider: CsvParserProvider,
  ) {}

  async execute({ file_identifier }: ImportKeplerPlanetsDTO): Promise<ImportKeplerPlanetsResponse> {
    const planetsParsedOrError = await this.csvParserProvider.parse({
      csvFile: file_identifier,
      unlinkAfterParse: true,
    });

    if (planetsParsedOrError.isLeft()) {
      return left(planetsParsedOrError.value);
    }

    const planetsParsed = planetsParsedOrError.value;

    const planets = await this.planetRepository.findAll({ telescope: 'kepler' });

    for (const planetParsed of planetsParsed) {
      const planetOrError = Planet.create({
        name: planetParsed.kepler_name as string,
        disposition: planetParsed?.koi_disposition as string,
        insolation: Number(planetParsed?.koi_insol),
        radius: Number(planetParsed?.koi_prad),
        stellar: Stellar.create({
          radius: Number(planetParsed?.koi_srad),
          effective_temperature: planetParsed?.koi_steff,
          age: planetParsed?.koi_sage,
          smet: planetParsed?.koi_smet as string,
          mass: planetParsed?.koi_smass,
        }),
        telescope: 'kepler',
      });

      if (planetOrError.isLeft()) {
        return left(planetOrError.value);
      }

      if (!planets.find(planet => planetOrError.value.props.name === planet.props.name)) {
        planets.push(planetOrError.value);
      }
    }

    const planetsCreated = await this.planetRepository.save(planets);

    return right(planetsCreated as Planet[]);
  }
}
