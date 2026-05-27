import { NextFunction } from 'express';
import * as userService from '../../services/admin/user.service';
import { TypedRequest, TypedResponse } from "../../types/handler";
import { CreateUserDTO, UpdateUserDTO } from "../../dtos/user.dto";
import { User } from "../../entities/user.entity";

export const getAllUsers = async (
    req: TypedRequest,
    res: TypedResponse<User[]>,
    next: NextFunction) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ data: users });
};


export const createUser = async (
    req: TypedRequest<{}, CreateUserDTO>,
    res: TypedResponse<User>,
    next: NextFunction) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ data: newUser });
};


export const deleteUser = async (
    req: TypedRequest<{ id: string }>,
    res: TypedResponse<undefined>,
    next: NextFunction) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
};


