import { NextFunction } from 'express';
import * as roomService from '../../services/admin/room.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateRoomDTO, UpdateRoomDTO } from '../../dtos/room.dto';
import { Room } from '../../entities/room.entity';


export const createRoom = async (req: TypedRequest<{}, CreateRoomDTO>, res: TypedResponse<Room>, next: NextFunction) => {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json({ data: newRoom });
};

export const updateRoom = async (req: TypedRequest<{ id: string }, UpdateRoomDTO>, res: TypedResponse<Room>, next: NextFunction) => {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json({ data: updatedRoom });
};

export const deleteRoom = async (req: TypedRequest<{ id: string }>, res: TypedResponse<undefined>, next: NextFunction) => {
    await roomService.deleteRoom(req.params.id);
    res.status(204).end();
};

