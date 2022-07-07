import 'reflect-metadata';
import { CSVCsvParserProvider } from '@infra/providers/csv/adapters/CSVCsvParserProvider';
import { PlanetsBuild } from '@modules/planets/domains/builds/PlanetsBuild';
import { Planet } from '@modules/planets/domains/Planet';
import { InMemoryPlanetsRepository } from '@modules/planets/infra/repositories/InMemoryPlanetsRepository';
import { ImportKeplerPlanetsUseCase } from './ImportKeplerPlanetsUseCase';

import { left } from '@shared/either';
import { InvalidPlanetDispositionException } from '@modules/planets/domains/exceptions/InvalidPlanetDispositionException';

import { FileHelper } from '@infra/test/helpers/FileHelper';

beforeEach(async () => {
  await FileHelper.dropFolder();
});

describe('[FUNCTIONAL] - [Planets] - ImportKeplerPlanets UseCase', () => {
  it('should be able to import a list of planets', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();
    const csvParserProvider = new CSVCsvParserProvider();

    const importKeplerPlanetsUseCase = new ImportKeplerPlanetsUseCase(planetsRepository, csvParserProvider);

    const csv = PlanetsBuild.createCSV({ data: [PlanetsBuild.generate()] });

    const file_identifier = 'valid_kepler_planets.csv';

    await FileHelper.writeFile(csv, file_identifier);

    const planetsOrError = await importKeplerPlanetsUseCase.execute({
      file_identifier,
    });

    const planetsCreated = await planetsRepository.findAll();

    expect(planetsOrError.isLeft()).toBeFalsy();

    const planets = planetsOrError.value as Planet[];

    expect(planetsCreated).toHaveLength(planets.length);
    expect(planets).toEqual(planetsCreated);
  });

  it('should be able to ignore planets that exists in database', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();
    const csvParserProvider = new CSVCsvParserProvider();

    const importKeplerPlanetsUseCase = new ImportKeplerPlanetsUseCase(planetsRepository, csvParserProvider);

    const existingPlanet = PlanetsBuild.generate();

    await planetsRepository.save(PlanetsBuild.create(existingPlanet));

    const planetToCreate = PlanetsBuild.generate({ name: 'KOI-7016.01' });

    const csv = PlanetsBuild.createCSV({ data: [existingPlanet, existingPlanet, existingPlanet, planetToCreate] });

    const file_identifier = 'valid_kepler_planets.csv';

    await FileHelper.writeFile(csv, file_identifier);

    const planetsOrError = await importKeplerPlanetsUseCase.execute({
      file_identifier,
    });

    expect(planetsOrError.isLeft()).toBeFalsy();

    const planets = await planetsRepository.findAll();

    expect(planets).toHaveLength(2);
  });

  it('should give an InvalidPlanetDispositionException, when csv disposition is invalid', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();
    const csvParserProvider = new CSVCsvParserProvider();

    const importKeplerPlanetsUseCase = new ImportKeplerPlanetsUseCase(planetsRepository, csvParserProvider);

    const csv = PlanetsBuild.createCSV({ data: [PlanetsBuild.generate({ disposition: 'INVALID' })] });

    const file_identifier = 'invalid_kepler_planets.csv';

    await FileHelper.writeFile(csv, file_identifier);

    const planetsOrError = await importKeplerPlanetsUseCase.execute({
      file_identifier,
    });

    expect(planetsOrError.isRight()).toBeFalsy();

    expect(planetsOrError).toEqual(left(new InvalidPlanetDispositionException('INVALID')));
  });
});
