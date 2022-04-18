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
  private constructor(props: StellarProps) {
    super(props);
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
