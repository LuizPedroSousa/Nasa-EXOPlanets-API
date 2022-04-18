import { ValueObject } from '@shared/domain/ValueObject';
import { Either, left, right } from '@shared/either';
import { InvalidPlanetDispositionException } from './exceptions/InvalidPlanetDispositionException';

interface PlanetDispositionProps {
  value: string;
}

export class PlanetDisposition extends ValueObject<PlanetDispositionProps> {
  public get value(): string {
    return this.props.value;
  }

  private constructor(props: PlanetDispositionProps) {
    super(props);
  }

  public static create(value: string): Either<InvalidPlanetDispositionException, PlanetDisposition> {
    if (!PlanetDisposition.validate(value)) {
      return left(new InvalidPlanetDispositionException(value));
    }

    return right(new PlanetDisposition({ value }));
  }

  public static validate(value: string): boolean {
    const planetDispositionRegex = /CONFIRMED|CANDIDATE|FALSE POSITIVE|NOT DISPOSITIONED/i;

    if (!planetDispositionRegex.test(value)) {
      return false;
    }

    return true;
  }
}
