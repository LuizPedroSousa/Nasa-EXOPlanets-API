import request from 'supertest';

import { main } from '@infra/http/main';
import { FileHelper } from '@infra/test/helpers/FileHelper';

import { PlanetsBuild } from '@modules/planets/domains/builds/PlanetsBuild';

beforeEach(async () => {
  main.init();
  await FileHelper.dropFolder();
});

describe('[INTEGRATION] - [Planets] - ImportKeplerPlanetsController', () => {
  it('should give a status 201 when the planets are imported', async () => {
    const planets = [PlanetsBuild.generate(), PlanetsBuild.generate({ name: 'Jupiter' })];
    const csv = PlanetsBuild.createCSV({ data: planets });

    const file_identifier = 'valid_kepler_planets.csv';

    await FileHelper.writeFile(csv, file_identifier);

    const { status, body } = await request(main.app)
      .post('/planets/kepler')
      .set('Accept', 'application/json')
      .attach('planets', FileHelper.getFilePath(file_identifier));

    expect(status).toBe(201);

    expect(body?.planets).toHaveLength(2);
    expect(body).toEqual({
      message: 'Created',
      planets: [
        expect.objectContaining({
          id: body?.planets[0].id,
          ...planets[0],
          stellar: {
            ...planets[0].stellar.toJSON(),
            id: body.planets[0].stellar.id,
          },
        }),
        expect.objectContaining({
          id: body?.planets[1].id,
          ...planets[1],
          stellar: {
            ...planets[1].stellar.toJSON(),
            id: body.planets[1].stellar.id,
          },
        }),
      ],
    });
  });

  it('should give a status 400, when planet disposition is invalid', async () => {
    const planets = [PlanetsBuild.generate(), PlanetsBuild.generate({ disposition: 'invalid' })];
    const csv = PlanetsBuild.createCSV({ data: planets });

    const file_identifier = 'invalid_kepler_planets.csv';

    await FileHelper.writeFile(csv, file_identifier);

    const { status, body } = await request(main.app)
      .post('/planets/kepler')
      .set('Accept', 'application/json')
      .attach('planets', FileHelper.getFilePath(file_identifier));

    expect(status).toBe(400);

    expect(body).toEqual({
      message: 'invalid is not a valid planet disposition',
    });
  });

  it('should give a status 400, when send a file with invalid extension', async () => {
    const planets = [PlanetsBuild.generate(), PlanetsBuild.generate()];
    const csv = PlanetsBuild.createCSV({ data: planets });

    const file_identifier = 'invalid_kepler_planets.csvv';

    await FileHelper.writeFile(csv, file_identifier);

    const { status, body } = await request(main.app)
      .post('/planets/kepler')
      .set('Accept', 'application/json')
      .attach('planets', FileHelper.getFilePath(file_identifier));

    expect(status).toBe(400);
    expect(body).toEqual({
      message: 'Invalid file extension: bin',
    });
  });

  it('should give a status 400 when send an empty file', async () => {
    const { status, body } = await request(main.app).post('/planets/kepler').set('Accept', 'application/json');

    expect(status).toBe(400);

    expect(body).toEqual(
      expect.objectContaining({
        message: 'Missing params: planets',
      }),
    );
  });
});
