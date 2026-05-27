import { Request, Response, NextFunction } from 'express';
import * as showTimeService from '../../services/admin/showtime.service';
import { TypedRequest, TypedResponse } from '../../types/handler';
import { CreateShowTimeDTO, UpdateShowTimeDTO } from '../../dtos/showtime.dto';
import { ShowTime } from '../../entities/showtime.entity';


export const creatShowTime = async (req: TypedRequest<{}, CreateShowTimeDTO>, res: TypedResponse<ShowTime>, next: NextFunction) => {
    const newShowTime = await showTimeService.createShowTime(req.body);
    res.status(201).json({ data: newShowTime });
};

export const updateShowTime = async (req: TypedRequest<{ id: string }, UpdateShowTimeDTO>, res: TypedResponse<ShowTime>, next: NextFunction) => {
    const updatedShowTime = await showTimeService.updateShowTime(req.params.id, req.body);
    res.status(200).json({ data: updatedShowTime });
};

export const deleteShowTime = async (req: TypedRequest<{ id: string }>, res: TypedResponse<undefined>, next: NextFunction) => {
    await showTimeService.deleteShowTime(req.params.id);
    res.status(204).end();
};

