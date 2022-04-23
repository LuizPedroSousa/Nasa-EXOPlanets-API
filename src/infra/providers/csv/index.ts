import { container } from 'tsyringe';
import { CsvParserProvider } from './ports/CsvParserProvider';
import { CSVCsvParserProvider } from './adapters/CSVCsvParserProvider';

container.registerSingleton<CsvParserProvider>('CsvParserProvider', CSVCsvParserProvider);
