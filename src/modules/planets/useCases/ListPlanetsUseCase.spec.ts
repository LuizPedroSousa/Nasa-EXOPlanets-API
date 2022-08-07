import { PlanetsBuild } from '@modules/planets/domains/builds/PlanetsBuild';
import { InMemoryPlanetsRepository } from '@modules/planets/infra/repositories/InMemoryPlanetsRepository';
import 'reflect-metadata';
import { ListPlanetsUseCase } from './ListPlanetsUseCase';

describe('[FUNCTIONAL] - [Planets] - ListPlanetsUseCase', () => {
  it('should be able to list all planets, without a query', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();

    await planetsRepository.save([
      PlanetsBuild.create(),
      PlanetsBuild.create(),
      PlanetsBuild.create(),
      PlanetsBuild.create(),
    ]);

    const listPlanetsUseCase = new ListPlanetsUseCase(planetsRepository);

    const planets = await listPlanetsUseCase.execute({});

    expect(planets).toHaveLength(4);

    const planetsCreated = await planetsRepository.findAll({});

    expect(planets).toEqual(planetsCreated);
  });

  it('should be able to list all planets by name and disposition', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();

    await planetsRepository.save([
      PlanetsBuild.create({ name: 'Kepler-1708b', telescope: 'kepler', disposition: 'CONFIRMED' }),
      PlanetsBuild.create({ name: 'Ursae Majoris c' }),
      PlanetsBuild.create({ name: 'Draconis' }),
      PlanetsBuild.create(),
    ]);

    const listPlanetsUseCase = new ListPlanetsUseCase(planetsRepository);

    const planets = await listPlanetsUseCase.execute({
      name: 'Kepler-1708b',
      disposition: 'CONFIRMED',
    });

    expect(planets).toHaveLength(1);

    const planetsCreated = await planetsRepository.findAll({
      name: 'Kepler-1708b',
      disposition: 'CONFIRMED',
    });

    expect(planets).toEqual(planetsCreated);
  });

  it('should be able to list all planets by kepler telescope', async () => {
    const planetsRepository = new InMemoryPlanetsRepository();

    await planetsRepository.save([
      PlanetsBuild.create({ telescope: 'kepler' }),
      PlanetsBuild.create(),
      PlanetsBuild.create(),
      PlanetsBuild.create(),
    ]);

    const listPlanetsUseCase = new ListPlanetsUseCase(planetsRepository);

    const planets = await listPlanetsUseCase.execute({ telescope: 'kepler' });

    expect(planets).toHaveLength(1);

    const planetsCreated = await planetsRepository.findAll({ telescope: 'kepler' });

    expect(planets).toEqual(planetsCreated);
  });
});
