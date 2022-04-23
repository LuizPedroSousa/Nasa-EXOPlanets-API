import { Stellar } from "@modules/stellars/Stellar";
import { Planet, CreatePlanetDTO } from "../Planet";

interface CreateCSVDTO {
  data: Partial<CreatePlanetDTO>[];
}

export class PlanetsBuild {
  static generate(data?: Partial<CreatePlanetDTO>) {
    const planet = {
      name: data?.name || "Tatooine",
      disposition: data?.disposition || "CONFIRMED",
      insolation: data?.insolation || 0.37,
      radius: data?.radius || 1.5,
      stellar:
        data?.stellar ||
        Stellar.create({
          radius: 10,
          mass: "1",
          age: "1",
          effective_temperature: "1",
          smet: "1",
        }),
      telescope: data?.telescope || "Kepler",
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
    const header = [
      "kepler_name,koi_disposition,koi_insol,koi_prad,koi_srad,koi_steff,koi_sage,koi_smet,koi_smass",
    ];

    const rows = data.map(
      ({
        name,
        disposition,
        insolation,
        radius,
        stellar: { props: stellar },
      }) => {
        return `${name},${disposition},${insolation},${radius},${stellar.radius},${stellar.effective_temperature},${stellar.age},${stellar.smet},${stellar.mass}`;
      }
    );

    const csv = header.concat(rows).join("\n");

    return csv;
  }
}
