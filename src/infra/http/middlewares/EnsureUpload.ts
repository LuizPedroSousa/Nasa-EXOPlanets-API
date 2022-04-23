import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mime from 'mime';
import { uploadConfig } from '@config/upload';
import { InvalidFileExtensionException } from '@shared/infra/exceptions/InvalidFileExtensionException';
import { InvalidFileSizeException } from '@shared/infra/exceptions/InvalidFileSizeException';
import crypto from 'crypto';

type Extension = 'csv';

interface FileFields {
  name: string;
  maxCount: number;
}

interface EnsureUploadDTO {
  extensions?: Extension[];
  file: string | FileFields[];
}

export class EnsureUpload {
  handle(options: EnsureUploadDTO) {
    return (req: Request, res: Response, next: NextFunction) => {
      const storage = multer.diskStorage({
        destination: uploadConfig.tmpFolder,
        filename(_, file, callback) {
          const extension = mime.getExtension(file.mimetype) as Extension;

          if (!EnsureUpload.validateExtension(extension, options.extensions)) {
            return callback(new InvalidFileExtensionException(extension), file.filename);
          }

          if (!EnsureUpload.validateFileSize(extension, options.extensions, file.size)) {
            return callback(new InvalidFileSizeException(file.originalname), file.filename);
          }

          return callback(null, EnsureUpload.formatFileName(file.originalname, extension));
        },
      });

      const upload = multer({ storage });

      if (Array.isArray(options.file)) {
        return upload.fields(options.file)(req, res, next);
      }

      return upload.single(options.file)(req, res, next);
    };
  }

  public static validateExtension(extension: Extension, extensions: Extension[]): boolean {
    const extensionsEnabled = extensions;

    if (!extensionsEnabled.includes(extension)) {
      return false;
    }

    return true;
  }

  public static validateFileSize(extension: Extension, extensions: Extension[], size: number): boolean {
    function isGreaterThanLimit(): boolean {
      let result = false;

      const MAX_FILE_SIZE_IN_MB = 2000; // 2mb

      if (extensions.includes(extension) && size > MAX_FILE_SIZE_IN_MB) {
        result = true;
      }

      return result;
    }

    if (isGreaterThanLimit()) {
      return false;
    }

    return true;
  }

  public static formatFileName(originalName: string, extension: Extension): string {
    let result = originalName;

    function replaceSpecialCharactersWithinString(fileName: string): string {
      const specialCharacters = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];

      specialCharacters.forEach(character => {
        result = result.replace(character, '');
      });

      return result;
    }

    function generateFileHash(): string {
      return crypto.randomBytes(10).toString('hex');
    }

    function formatFileName(): string {
      let result = replaceSpecialCharactersWithinString(originalName);

      function replaceBlankSpaces(): void {
        result = result.replace(/\s/g, '-');
      }

      function replaceExtension(): void {
        result = result.replace(/\.[^/.]+$/, '');
        result = result.replace(extension, '');
        result = `${result}.${extension}`;
      }

      replaceBlankSpaces();
      replaceExtension();

      return result;
    }

    result = `${generateFileHash()}-${formatFileName()}`;

    return result;
  }
}

export const ensureUpload = new EnsureUpload();
