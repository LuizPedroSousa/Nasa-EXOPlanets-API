import { UniqueIdentifier } from './UniqueIdentifier';

const isEntity = (other: any): other is Entity<any> => {
  return other instanceof Entity;
};

export abstract class Entity<T> {
  constructor(readonly props: T, protected readonly id?: UniqueIdentifier) {
    this.id = id || new UniqueIdentifier();
    this.props = props;
  }

  public equals(other: Entity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (!isEntity(other)) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
