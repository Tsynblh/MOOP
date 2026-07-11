export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

export interface MovieDetails extends Movie {
    runtime?: number;
    genres: Array<{ id: number; name: string }>;
    credits?: {
        cast: Array<{
            id: number;
            name: string;
            character: string;
            profile_path: string;
        }>;
    };
    videos?: {
        results: Array<{
            id: string;
            key: string;
            name: string;
            site: string;
            type: string;
            official?: boolean;
        }>;
    };
}
