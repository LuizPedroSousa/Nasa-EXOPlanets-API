import { EnsureUpload } from './EnsureUpload';

describe('[UNIT] - EnsureUpload Middleware', () => {
  it('should return true, when file extension is valid', () => {
    expect(EnsureUpload.validateExtension('csv', ['csv'])).toBe(true);
  });

  it('should return false, when file extension is invalid', () => {
    expect(EnsureUpload.validateExtension('csv', ['png' as any])).toBe(false);
  });

  it('should return true, when file size is equal to 2000', () => {
    expect(EnsureUpload.validateFileSize('csv', ['csv'], 2000)).toBe(true);
  });

  it('should return false, when file size is greater than 2000', () => {
    expect(EnsureUpload.validateFileSize('csv', ['csv'], 2001)).toBe(false);
  });

  it('should return true, when file size is greater than 2000 but the exntesion is not passs', () => {
    expect(EnsureUpload.validateFileSize('csv', ['png' as any], 2005)).toBe(true);
  });
});
