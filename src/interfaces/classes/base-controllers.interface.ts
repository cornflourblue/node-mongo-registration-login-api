import { Request, Response } from 'express';

export declare class BaseController {

  index(req?: Request, res?: Response): Promise<Response>;

  create(req?: Request, res?: Response): Promise<Response>;

  show(req?: Request, res?: Response): Promise<Response>;

  update(req?: Request, res?: Response): Promise<Response>;

  delete(req?: Request, res?: Response): Promise<Response>;
}
