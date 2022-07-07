import { BaseController } from '@shared/infra/BaseController';
import { HttpRequest } from '@shared/infra/HttpRequest';
import { Request, Response } from 'express';

export const routeAdapter = (controller: BaseController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      file: {
        fieldname: req?.file?.fieldname,
        originalname: req?.file?.originalname,
        encoding: req?.file?.encoding,
        mimetype: req?.file?.mimetype,
        destination: req?.file?.destination,
        filename: req?.file?.filename,
        path: req?.file?.path,
        size: req?.file?.size,
      },
      query: req?.query,
      params: req?.params,
    };

    const httpResponse = await controller.execute(httpRequest);

    return res.status(httpResponse.status).json(httpResponse.body);
  };
};
