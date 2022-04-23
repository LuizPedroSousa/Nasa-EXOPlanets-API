import { uploadConfig } from '@config/upload';
import fs from 'fs';
import path from 'path';

export class FileHelper {
  static async writeFile(data: string, file_identifier: string) {
    const testPath = path.resolve(uploadConfig.tmpFolder, file_identifier);

    await new Promise<void>((resolve, reject) => {
      fs.writeFile(testPath, data, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  static async dropFolder(folder?: string) {
    const testPath = path.resolve(uploadConfig.tmpFolder, folder || './');

    await new Promise<void>((resolve, reject) => {
      fs.readdir(testPath, (err, files) => {
        if (err) {
          reject(err);
        }

        for (const file of files) {
          fs.unlink(path.join(testPath, file), err => {
            if (err) {
              reject(err);
            }
          });
        }

        resolve();
      });
    });
  }

  static getFilePath(file_identifier: string) {
    return path.resolve(uploadConfig.tmpFolder, file_identifier);
  }
}
