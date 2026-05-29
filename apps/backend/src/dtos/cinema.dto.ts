export interface CreateCinemaDTO {
    name: string;
    address: string;
    regions: string;
    distance: string;
    facilities: string;
    image?: string;
}

export interface UpdateCinemaDTO {
    name?: string;
    address?: string;
    regions?: string;
    distance?: string;
    facilities?: string;
    image?: string;
}

