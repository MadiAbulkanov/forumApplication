import { formatErrors } from '@/helpers/formatErrors';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

type Constructor<T> = { new (): T };

export function ValidateDto<T extends object>(dtoClass: Constructor<T>) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value as RequestHandler;
    if (typeof originalMethod === 'function') {
      descriptor.value = async function async(req: Request, res: Response, next: NextFunction) {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject, { whitelist: true });
        if (errors.length > 0) {
          res.status(400).send(formatErrors(errors));
          return;
        }
        req.body = dtoObject;
        await originalMethod.apply(this, [req, res, next]);
      };

      return descriptor;
    }
    throw Error(`${propertyKey} is not a function`);
  };
}