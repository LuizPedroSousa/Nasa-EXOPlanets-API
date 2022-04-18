import { Entity } from '@shared/domain/Entity';
import { Either, left, right } from '@shared/either';

import { PlanetHabitable } from './PlanetHabitable';
import { PlanetDisposition } from './PlanetDisposition';
import { InvalidPlanetDispositionException } from './exceptions/InvalidPlanetDispositionException';
import { CreateStellarDTO, Stellar } from '@modules/stellars/Stellar';

export interface PlanetProps {
  name: string;
  telescope: string;
  habitable: PlanetHabitable;
  disposition: PlanetDisposition;
  stellar: Stellar;
  radius: number;
  insolation: number;
}

export interface CreatePlanetDTO {
  name: string;
  telescope: string;
  disposition: string;
  stellar: Stellar;
  radius: number;
  insolation: number;
}

export class Planet extends Entity<PlanetProps> {
  private constructor(props: PlanetProps) {
    super(props);
  }

  static create(data: CreatePlanetDTO): Either<InvalidPlanetDispositionException, Planet> {
    const dispositionOrError = PlanetDisposition.create(data.disposition);

    if (dispositionOrError.isLeft()) {
      return left(dispositionOrError.value);
    }

    const habitable = PlanetHabitable.create({
      radius: data.radius,
      disposition: data.disposition,
      insolation: data.insolation,
    });

    return right(
      new Planet({
        ...data,
        habitable,
        disposition: dispositionOrError.value,
      }),
    );
  }
}
