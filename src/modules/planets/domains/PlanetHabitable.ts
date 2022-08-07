import { ValueObject } from '@shared/domain/ValueObject';

interface PlanetHabitableProps {
  value: boolean;
}

interface CreatePlanetHabitableDTO {
  insolation: number;
  disposition: string;
  radius: number;
}

export class PlanetHabitable extends ValueObject<PlanetHabitableProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: PlanetHabitableProps) {
    super(props);
  }

  public static save(value: boolean): PlanetHabitable {
    return new PlanetHabitable({ value });
  }

  public static create(data: CreatePlanetHabitableDTO): PlanetHabitable {
    return new PlanetHabitable({ value: PlanetHabitable.isHabitable(data) });
  }

  public static isHabitable({ disposition, insolation, radius }: CreatePlanetHabitableDTO): boolean {
    const dispositionRegex = /CONFIRMED/gi;

    if (!dispositionRegex.test(disposition)) {
      return false;
    }

    if (insolation < 0.37 || insolation > 1.11) {
      return false;
    }

    if (radius < 0.5 || radius > 1.5) {
      return false;
    }

    return true;
  }
}
