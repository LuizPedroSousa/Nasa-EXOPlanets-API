import { BaseController } from '@shared/infra/BaseController';
import { File } from '@shared/infra/HttpRequest';
import { Request, Response } from 'express';

export const routeAdapter = (controller: BaseController) => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      file: req?.file as any,
    };

    const httpResponse = await controller.execute(httpRequest);

    return res.status(httpResponse.status).json(httpResponse.body);
  };
};
