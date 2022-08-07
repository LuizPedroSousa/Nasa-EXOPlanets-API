import { Entity } from '@shared/domain/Entity';
import { UniqueIdentifier } from '@shared/domain/UniqueIdentifier';

interface StellarProps {
  mass: string;
  effective_temperature: string;
  smet: string;
  radius: number;
  age: string;
}

export interface CreateStellarDTO {
  mass: string;
  effective_temperature: string;
  smet: string;
  radius: number;
  age: string;
}

export class Stellar extends Entity<StellarProps> {
  private constructor(props: StellarProps, id?: UniqueIdentifier) {
    super(props, id);
  }

  static save({ id, ...data }: StellarProps & { id: string }): Stellar {
    return new Stellar(data, new UniqueIdentifier(id));
  }

  static create(data: CreateStellarDTO): Stellar {
    return new Stellar({
      mass: data.mass,
      effective_temperature: data.effective_temperature,
      smet: data.smet,
      radius: data.radius,
      age: data.age,
    });
  }
}
