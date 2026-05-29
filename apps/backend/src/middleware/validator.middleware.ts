import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { TypedRequest } from '../types/handler';

type DtoConstructor<T> = new () => T;

export const validateBody = <T extends object>(dtoClass: DtoConstructor<T>) => {
    return async (req: TypedRequest<{}, T>, res: Response, next: NextFunction) => {
        const instance = plainToInstance(dtoClass, req.body);
        const errors = await validate(instance, {
            whitelist: true,
            forbidNonWhitelisted: false,
            skipMissingProperties: false,
        });

        if (errors.length > 0) {
            const messages = errors
                .map((error: ValidationError) =>
                    Object.values(error.constraints || {}).join(', ')
                )
                .join('; ');
            return next(new AppError(messages, 400));
        }

        req.body = instance;
        next();
    };
};
