import { UserRole } from '../enums/role';
import { TypedRequest, TypedResponse } from '../types/handler';
import { AppError } from '../utils/app-error';

export function assertOwnership(resourceOwnerId: string, currentUserId?: string) {
    if (!currentUserId || resourceOwnerId !== currentUserId) {
        throw new AppError('Forbidden: You do not own this resource', 403);
    }
}


