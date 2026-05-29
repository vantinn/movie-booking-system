import { Request, Response, NextFunction } from "express";
import { UserRole } from '../enums/role';


export interface ApiResponse<T> {
    data?: T | null;
    message?: string | null
    status?: string
    statusCode?: number

}


export type ControllerHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Request | void>;

export type TypedResponse<T> = Response<ApiResponse<T>>




export type AuthUser = {
    id: string
    role: UserRole
}



export type TypedRequest<
    TParams = {},
    TBody = {},
    TQuery = {}
> = Request<TParams, {}, TBody, TQuery> & { user?: AuthUser };


