import { shallowEqual } from 'shallow-equal-object';

interface ValueObjectProps {
  [key: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  constructor(readonly props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.props === undefined) {
      return false;
    }

    return shallowEqual(this.props, other.props);
  }
}
