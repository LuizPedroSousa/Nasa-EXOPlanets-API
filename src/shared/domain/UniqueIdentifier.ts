import { v4 as uuid } from 'uuid';
import { Identifier } from './Identifier';

export class UniqueIdentifier extends Identifier<string> {
  constructor(id?: Identifier) {
    super(id || uuid());
  }
}
