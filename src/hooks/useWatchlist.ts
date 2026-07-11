"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Movie } from "@/types/movie";

export interface WatchlistMovie extends Partial<Movie> {
    movie_id: number;
    movie_title: string;
    poster_path: string;
    vote_average: number;
    added_at?: string;
    id: number;
    title: string;
}

type AddToWatchlistResult = "added" | "exists" | "unauthenticated" | "error";

const normalizeWatchlistMovie = (item: WatchlistMovie): WatchlistMovie => {
    return {
        ...item,
        id: item.movie_id,
        title: item.movie_title,
        overview: item.overview || "",
        backdrop_path: item.backdrop_path || "",
        release_date: item.release_date || "",
        genre_ids: item.genre_ids || [],
    };
};

const dedupeWatchlist = (items: WatchlistMovie[]) => {
    const uniqueItems = new Map<number, WatchlistMovie>();

    items.forEach((item) => {
        if (!uniqueItems.has(item.movie_id)) {
            uniqueItems.set(item.movie_id, normalizeWatchlistMovie(item));
        }
    });

    return Array.from(uniqueItems.values());
};

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchWatchlist = async () => {
        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setIsAuthenticated(false);
            setWatchlist([]);
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);

        const { data, error } = await supabase
            .from("watchlist")
            .select("*")
            .eq("user_id", user.id)
            .order("added_at", { ascending: false });

        if (error) {
            console.error("Error fetching watchlist:", error);
            setWatchlist([]);
            setLoading(false);
            return;
        }

        setWatchlist(dedupeWatchlist((data || []) as WatchlistMovie[]));
        setLoading(false);
    };

    const addToWatchlist = async (movie: Movie): Promise<AddToWatchlistResult> => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return "unauthenticated";
        }

        const { data: existingMovie, error: existingError } = await supabase
            .from("watchlist")
            .select("movie_id")
            .eq("user_id", user.id)
            .eq("movie_id", movie.id)
            .maybeSingle();

        if (existingError) {
            console.error("Error checking watchlist:", existingError);
            return "error";
        }

        if (existingMovie) {
            return "exists";
        }

        const { error } = await supabase.from("watchlist").insert({
            user_id: user.id,
            movie_id: movie.id,
            movie_title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
        });

        if (error) {
            console.error("Error adding to watchlist:", error);
            return "error";
        }

        await fetchWatchlist();
        return "added";
    };

    const removeFromWatchlist = async (movieId: number) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return;
        }

        const { error } = await supabase
            .from("watchlist")
            .delete()
            .eq("user_id", user.id)
            .eq("movie_id", movieId);

        if (error) {
            console.error("Error removing from watchlist:", error);
            return;
        }

        await fetchWatchlist();
    };

    useEffect(() => {
        Promise.resolve().then(fetchWatchlist);

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(Boolean(session?.user));
            Promise.resolve().then(fetchWatchlist);
        });

        return () => subscription.unsubscribe();
    }, []);

    return {
        watchlist,
        loading,
        isAuthenticated,
        addToWatchlist,
        removeFromWatchlist,
        fetchWatchlist,
    };
}
