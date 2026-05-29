
export interface CreateMovieDTO {
    title: string;
    image: string;
    trailer: string;
    release_date: Date;
    rating: string;
    duration: string;
    genres: string;
    description: string;
}

export interface UpdateMovieDTO {
    title?: string;
    image?: string;
    trailer?: string;
    release_date?: Date;
    rating?: string;
    duration?: string;
    genres?: string;
    description?: string;
}







