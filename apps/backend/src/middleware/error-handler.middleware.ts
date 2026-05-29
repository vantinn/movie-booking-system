import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { TypedRequest, TypedResponse, ApiResponse } from '../types/handler';


export const errorHandler = (
    err: unknown,
    req: TypedRequest,
    res: TypedResponse<ApiResponse<unknown>>,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (Array.isArray(err) && err[0] instanceof ValidationError) {
        statusCode = 400;
        message = err
            .map((e: ValidationError) => Object.values(e.constraints || {}).join(', '))
            .join(', ');
    }

    else if (err instanceof QueryFailedError) {
        statusCode = 400;
        message = `Database Error: ${(err).message || 'Query failed'}`;
    }

    else if (err instanceof EntityNotFoundError) {
        statusCode = 404;
        message = 'Resource not found';
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    else if (err instanceof Error) {
        message = err.message;
    }

    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

