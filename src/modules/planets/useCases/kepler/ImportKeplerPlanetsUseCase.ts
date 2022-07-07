import { CSVParsed, CsvParserProvider } from '@infra/providers/csv/ports/CsvParserProvider';
import { InvalidPlanetDispositionException } from '@modules/planets/domains/exceptions/InvalidPlanetDispositionException';
import { Planet } from '@modules/planets/domains/Planet';
import { Stellar } from '@modules/stellars/Stellar';
import { UseCase } from '@shared/domain/UseCase';
import { Either, left, right } from '@shared/either';
import { inject, injectable } from 'tsyringe';
import { PlanetsRepository } from '../../ports/PlanetsRepository';
import { ImportKeplerPlanetsDTO } from './dtos/ImportKeplerPlanetsDTO';
import { ImportKeplerPlanetsResponse } from './responses/ImportKeplerPlanetsResponse';

@injectable()
export class ImportKeplerPlanetsUseCase implements UseCase<ImportKeplerPlanetsDTO, ImportKeplerPlanetsResponse> {
  constructor(
    @inject('PlanetsRepository')
    private planetRepository: PlanetsRepository,
    @inject('CsvParserProvider')
    private csvParserProvider: CsvParserProvider,
  ) {}

  private parsePlanetsCsvToDomain(
    planetsCsv: CSVParsed[],
    planetsExists: Planet[],
  ): Either<InvalidPlanetDispositionException, Planet[]> {
    const planets: Planet[] = [];

    for (const planetParsed of planetsCsv) {
      const planetOrError = Planet.create({
        name: planetParsed.kepler_name as string,
        disposition: planetParsed?.koi_disposition as string,
        insolation: Number(planetParsed?.koi_insol),
        radius: Number(planetParsed?.koi_prad),
        telescope: 'kepler',
        stellar: Stellar.create({
          radius: Number(planetParsed?.koi_srad),
          effective_temperature: planetParsed?.koi_steff,
          age: planetParsed?.koi_sage,
          smet: planetParsed?.koi_smet as string,
          mass: planetParsed?.koi_smass,
        }),
      });

      if (planetOrError.isLeft()) {
        return left(planetOrError.value);
      }

      if (!planetsExists.find(planet => planetOrError.value.props.name === planet.props.name)) {
        planets.push(planetOrError.value);
      }
    }

    return right(planets);
  }

  async execute({ file_identifier }: ImportKeplerPlanetsDTO): Promise<ImportKeplerPlanetsResponse> {
    const planetsParsedOrError = await this.csvParserProvider.parse({
      csvFile: file_identifier,
      unlinkAfterParse: true,
    });

    if (planetsParsedOrError.isLeft()) {
      return left(planetsParsedOrError.value);
    }

    const planetsCsv = planetsParsedOrError.value;

    const planetsExists = await this.planetRepository.findAll({ telescope: 'kepler' });

    const planetsOrError = this.parsePlanetsCsvToDomain(planetsCsv, planetsExists);

    if (planetsOrError.isLeft()) {
      return left(planetsOrError.value);
    }

    const planets = planetsOrError.value;

    const planetsCreated = await this.planetRepository.save(planets);

    return right(planetsCreated as Planet[]);
  }
}
