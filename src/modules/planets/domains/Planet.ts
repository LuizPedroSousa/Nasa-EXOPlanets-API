import { Entity } from '@shared/domain/Entity';
import { Either, left, right } from '@shared/either';

import { PlanetHabitable } from './PlanetHabitable';
import { PlanetDisposition } from './PlanetDisposition';
import { InvalidPlanetDispositionException } from './exceptions/InvalidPlanetDispositionException';
import { Stellar } from '@modules/stellars/Stellar';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';

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
  get disposition() {
    return this.props.disposition.value;
  }

  get habitable() {
    return this.props.habitable.value;
  }

  get stellar() {
    return this.props.stellar;
  }

  private constructor(props: PlanetProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...data }: PlanetProps & { id: string }): Planet {
    return new Planet(data, new UniqueIdentifier(id));
  }

  static create({ name, ...data }: CreatePlanetDTO): Either<InvalidPlanetDispositionException, Planet> {
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
        name: name || '-',
        habitable,
        disposition: dispositionOrError.value,
      }),
    );
  }
}
