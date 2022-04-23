import { Either } from '@shared/either';
import { ParseCSVDTO } from '../dtos/ParseCSVDTO';
import { InvalidCSVException } from '../exceptions/InvalidCSVException';

export interface CSVParsed {
  [key: string]: any;
}

export type CSVParserResponse = Either<InvalidCSVException, CSVParsed[]>;

export interface CsvParserProvider {
  parse(data: ParseCSVDTO): Promise<CSVParserResponse>;
}
