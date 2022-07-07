import { InvalidCSVException } from '@infra/providers/csv/exceptions/InvalidCSVException';
import { Planet } from '@modules/planets/domains/Planet';
import { Either } from '@shared/either';

export type ImportKeplerPlanetsResponse = Either<InvalidCSVException, Planet[]>;
