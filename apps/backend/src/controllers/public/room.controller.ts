import { Request, Response, NextFunction } from 'express';
import * as roomService from '../../services/public/room.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateRoomDTO, UpdateRoomDTO } from '../../dtos/room.dto';
import { Room } from '../../entities/room.entity';
import { AppError } from '../../utils/app-error';


export const getAllRooms = async (req: TypedRequest, res: TypedResponse<Room[]>, next: NextFunction) => {
    const room = await roomService.getAllRoom();
    res.status(200).json({ data: room });
};

export const getRoomsByIdsHandler = async (
    req: TypedRequest<{}, {}, { ids?: string }>,
    res: TypedResponse<Room[]>,
    next: NextFunction
) => {
    const ids = req.query.ids?.split(',').filter(Boolean) ?? [];
    if (ids.length === 0) return res.status(200).json({ data: [] });
    const rooms = await roomService.getRoomsByIds(ids);
    res.status(200).json({ data: rooms });
};

/**
 * Merged handler: GET /rooms → all, GET /rooms?ids=a,b → by ids.
 * This replaces the duplicate GET '/' pattern in the old router.
 */
export const getRoomsHandler = async (
    req: TypedRequest<{}, {}, { ids?: string }>,
    res: TypedResponse<Room[]>,
    next: NextFunction
) => {
    try {
        const ids = req.query.ids?.split(',').filter(Boolean) ?? [];
        if (ids.length > 0) {
            const rooms = await roomService.getRoomsByIds(ids);
            return res.status(200).json({ data: rooms });
        }
        const rooms = await roomService.getAllRoom();
        res.status(200).json({ data: rooms });
    } catch (err) {
        next(err);
    }
};









