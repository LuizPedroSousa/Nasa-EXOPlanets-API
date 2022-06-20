import { CsvParserProvider, CSVParserResponse, CSVParsed } from '../ports/CsvParserProvider';
import { left, right } from '@shared/either';
import { InvalidCSVException } from '../exceptions/InvalidCSVException';
import fs from 'fs';
import path from 'path';
import { uploadConfig } from '@config/upload';
import { injectable } from 'tsyringe';
import { ParseCSVDTO } from '../dtos/ParseCSVDTO';

import parser from 'csv-parser';

@injectable()
export class CSVCsvParserProvider implements CsvParserProvider {
  async parse({ unlinkAfterParse, csvFile }: ParseCSVDTO): Promise<CSVParserResponse> {
    try {
      const csvParsedData = await this.readCSVStream(csvFile);

      if (unlinkAfterParse) {
        await this.unlinkFile(csvFile);
      }

      return right(csvParsedData);
    } catch (error) {
      console.log(error);
      return left(new InvalidCSVException());
    }
  }

  private async readCSVStream(file_name: string): Promise<CSVParsed[]> {
    const data = await new Promise<CSVParsed[]>((resolve, reject) => {
      const originalPath = path.resolve(uploadConfig.tmpFolder, file_name);

      const results: CSVParsed[] = [];

      fs.createReadStream(originalPath, 'utf-8')
        .on('error', error => reject(error))
        .pipe(parser())
        .on('data', (data: CSVParsed) => results.push(data))
        .on('end', () => resolve(results));
    });

    return data;
  }

  private async unlinkFile(file_name: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file_name);

    await new Promise<void>((resolve, reject) => {
      fs.unlink(originalPath, error => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }
}
