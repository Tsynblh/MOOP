const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function getTrendingMovies() {
    const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=id-ID`);
    if (!res.ok) throw new Error("Failed to fetch trending");
    return res.json();
}

export async function getMovieById(id: string) {
    const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits&language=id-ID`
    );
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return res.json();
}

export async function searchMovies(query: string) {
    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=id-ID`
    );
    if (!res.ok) throw new Error("Failed to search");
    return res.json();
}