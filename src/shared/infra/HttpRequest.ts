export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface HttpRequest {
  body?: any;
  file?: File;
  query?: any;
  params?: any;
}
