import { Stellar } from '@modules/stellars/Stellar';
import { Planet, CreatePlanetDTO } from '../Planet';

interface CreateCSVDTO {
  data: Partial<CreatePlanetDTO>[];
}

import { faker } from '@faker-js/faker';

export class PlanetsBuild {
  static generate(data?: Partial<CreatePlanetDTO>): CreatePlanetDTO {
    const planet: CreatePlanetDTO = {
      name: data?.name || faker.name.suffix(),
      disposition: data?.disposition || faker.helpers.arrayElement(['CONFIRMED', 'CANDIDATE']),
      insolation: data?.insolation || Number(faker.random.numeric()),
      radius: data?.radius || Number(faker.random.numeric()),
      stellar:
        data?.stellar ||
        Stellar.create({
          radius: Number(faker.random.numeric()),
          mass: faker.random.numeric(),
          age: faker.random.numeric(),
          effective_temperature: faker.random.numeric(),
          smet: faker.random.numeric(),
        }),
      telescope: data?.telescope || faker.name.suffix(),
    };

    return planet;
  }

  static create(data?: Partial<CreatePlanetDTO>) {
    const planet = this.generate(data);

    return Planet.create(planet).value as Planet;
  }

  static createInvalid(data?: Partial<CreatePlanetDTO>) {
    const planet = this.generate(data);

    return Planet.create(planet);
  }

  static createCSV({ data }: CreateCSVDTO) {
    const header = ['kepler_name,koi_disposition,koi_insol,koi_prad,koi_srad,koi_steff,koi_sage,koi_smet,koi_smass'];

    const rows = data.map(({ name, disposition, insolation, radius, stellar: { props: stellar } }) => {
      return `${name},${disposition},${insolation},${radius},${stellar.radius},${stellar.effective_temperature},${stellar.age},${stellar.smet},${stellar.mass}`;
    });

    const csv = header.concat(rows).join('\n');

    return csv;
  }
}
