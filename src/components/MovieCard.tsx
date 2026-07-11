"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Movie } from "@/types/movie";

interface MovieCardProps {
    movie: Movie;
    onClick?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "/placeholder.jpg";

    return (
        <div 
            className="movie-card group cursor-pointer"
            onClick={() => onClick?.(movie)}
        >
            <div className="relative overflow-hidden rounded-xl aspect-2/3 bg-[#1A1A1A]">
                <Image 
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                />
                
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-1 text-xs sm:right-3 sm:top-3 sm:text-sm">
                    <Star className="text-[#F4A261]" size={14} fill="#F4A261" />
                    <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                </div>
            </div>

            <div className="mt-3 px-1">
                <h3 className="heading-font line-clamp-2 text-base font-semibold transition-colors group-hover:text-[#F4A261] sm:text-lg">
                    {movie.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                    {movie.release_date?.substring(0, 4)}
                </p>
            </div>
        </div>
    );
}
