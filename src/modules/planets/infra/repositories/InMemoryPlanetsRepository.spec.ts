import { PlanetsBuild } from '@modules/planets/domains/builds/PlanetsBuild';
import { PlanetNotFoundException } from '@modules/planets/useCases/exceptions/PlanetNotFoundException';
import { InMemoryPlanetsRepository } from './InMemoryPlanetsRepository';

describe('[UNIT] - [Planets] - InMemoryPlanetsRepository', () => {
  it('should be able to save a planet', async () => {
    const repository = new InMemoryPlanetsRepository();

    const planet = PlanetsBuild.create();

    await repository.save(planet);

    const planets = await repository.findAll();

    expect(planets).toHaveLength(1);
    expect(planets[0]).toEqual(planet);
  });

  it('should be able to find all planets by name', async () => {
    const repository = new InMemoryPlanetsRepository();

    const planet = PlanetsBuild.create({ name: 'Tatooine' });

    await repository.save([planet, PlanetsBuild.create({ name: 'Alderaan' })]);

    const planets = await repository.findAll({ name: 'Tatooine' });

    expect(planets).toHaveLength(1);
    expect(planets[0]).toEqual(planet);
  });

  it('should be able to find one planet by name', async () => {
    const repository = new InMemoryPlanetsRepository();

    const planet = PlanetsBuild.create({ name: 'Tatooine' });

    await repository.save([planet, PlanetsBuild.create()]);

    const planetExistsOrError = await repository.findByName('Tatooine');

    expect(planetExistsOrError.isLeft()).toBeFalsy();

    const planetExists = planetExistsOrError.value;

    expect(planetExists).toEqual(expect.objectContaining(planet));
  });

  it('should be able to find one planet by id', async () => {
    const repository = new InMemoryPlanetsRepository();

    const planet = PlanetsBuild.create();

    await repository.save(planet);

    const planetExistsOrError = await repository.findById(planet.id);

    expect(planetExistsOrError.isLeft()).toBeFalsy();

    const planetExists = planetExistsOrError.value;

    expect(planetExists).toEqual(expect.objectContaining(planet));
  });

  it('should be able to find one planet by name and return an error if not found', async () => {
    const repository = new InMemoryPlanetsRepository();

    const planet = PlanetsBuild.create({ name: 'Tatooine' });

    await repository.save([planet, PlanetsBuild.create()]);

    const planetExistsOrError = await repository.findByName('Alderaan');

    expect(planetExistsOrError.isLeft()).toBeTruthy();

    const planetExists = planetExistsOrError.value;

    expect(planetExists).toEqual(new PlanetNotFoundException());
  });
});
