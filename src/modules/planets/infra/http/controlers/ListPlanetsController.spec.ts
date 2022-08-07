import { main } from '@infra/http/main';
import { PlanetsBuild } from '@modules/planets/domains/builds/PlanetsBuild';
import { PlanetsRepository } from '@modules/planets/ports/PlanetsRepository';
import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';

beforeEach(() => {
  main.init();
});

describe('[INTEGRATION] - [Planets] - ListPlanetsController', () => {
  it('should give a status 200 with a list of all planets', async () => {
    const planetsRepository = container.resolve<PlanetsRepository>('PlanetsRepository');

    await planetsRepository.save([PlanetsBuild.create(), PlanetsBuild.create(), PlanetsBuild.create()]);

    const { status, body } = await request(main.app).get('/planets').set('Accept', 'application/json');

    expect(status).toBe(200);

    const planetsExpected = await planetsRepository.findAll();

    expect(body.planets).toHaveLength(3);
    expect(body).toEqual({
      message: 'OK',
      planets: expect.arrayContaining([expect.objectContaining(planetsExpected[0].toJSON())]),
    });
  });

  it('should be able to find planets by kepler telescope', async () => {
    const planetsRepository = container.resolve<PlanetsRepository>('PlanetsRepository');

    await planetsRepository.save([
      PlanetsBuild.create(),
      PlanetsBuild.create(),
      PlanetsBuild.create({ telescope: 'kepler' }),
    ]);

    const { status, body } = await request(main.app)
      .get('/planets')
      .query({ telescope: 'kepler' })
      .set('Accept', 'application/json');

    expect(status).toBe(200);

    expect(body.planets).toHaveLength(1);
    expect(body).toEqual({
      message: 'OK',
      planets: expect.arrayContaining([expect.objectContaining({ telescope: 'kepler' })]),
    });
  });

  it('should be able to find planets by name', async () => {
    const planetsRepository = container.resolve<PlanetsRepository>('PlanetsRepository');

    await planetsRepository.save([
      PlanetsBuild.create(),
      PlanetsBuild.create(),
      PlanetsBuild.create({ name: 'Jupiter' }),
    ]);

    const { status, body } = await request(main.app)
      .get('/planets')
      .query({ name: 'Jupiter' })
      .set('Accept', 'application/json');

    expect(status).toBe(200);

    expect(body.planets).toHaveLength(1);
    expect(body).toEqual({
      message: 'OK',
      planets: expect.arrayContaining([expect.objectContaining({ name: 'Jupiter' })]),
    });
  });
});
