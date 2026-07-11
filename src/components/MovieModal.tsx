"use client";

import Image from "next/image";
import { X, Star, Play } from "lucide-react";
import { MovieDetails } from "@/types/movie";

interface MovieModalProps {
    movie: MovieDetails | null;
    isOpen: boolean;
    onClose: () => void;
    onWatchlistAction?: (movie: MovieDetails) => void | Promise<void>;
    watchlistActionLabel?: string;
}

export default function MovieModal({
    movie,
    isOpen,
    onClose,
    onWatchlistAction,
    watchlistActionLabel = "Tambah ke Watchlist",
}: MovieModalProps) {
    if (!movie || !isOpen) return null;

    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "/placeholder.jpg";

    return (
        <div className="fixed inset-0 z-100 overflow-y-auto bg-black/90 p-3 backdrop-blur-md sm:p-4 md:flex md:items-center md:justify-center" onClick={onClose}>
            <div 
                className="relative mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#1A1A1A] md:my-0 md:w-auto md:max-h-[calc(100vh-2rem)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2.5 text-white transition-colors hover:bg-black sm:top-6 sm:right-6 sm:p-3"
                >
                    <X size={22} />
                </button>

                <div className="flex flex-col md:max-h-[calc(100vh-2rem)] md:flex-row">
                    {/* Left: Poster */}
                    <div className="shrink-0 bg-black">
                        <Image 
                            src={posterUrl}
                            alt={movie.title}
                            width={500}
                            height={750}
                            className="h-auto w-full md:w-[320px] lg:w-[380px]"
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6 md:w-[420px] md:overflow-y-auto md:p-8 lg:w-[520px]">
                        <h1 className="heading-font mb-2 pr-12 text-3xl font-bold sm:text-4xl">{movie.title}</h1>
                        
                        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 sm:mb-6">
                            <span>{movie.release_date?.substring(0, 4)}</span>
                            {movie.runtime && <span>{movie.runtime} menit</span>}
                            <div className="flex items-center gap-1">
                                <Star className="text-[#F4A261]" size={18} fill="#F4A261" />
                                <span className="font-medium text-white">{movie.vote_average.toFixed(1)}</span>
                            </div>
                        </div>

                        <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:mb-8 sm:text-base">
                            {movie.overview}
                        </p>

                        {/* Genres */}
                        {movie.genres && (
                            <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
                                {movie.genres.map(genre => (
                                    <span 
                                        key={genre.id}
                                        className="rounded-full bg-white/10 px-3 py-1 text-xs sm:px-4 sm:text-sm"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <button className="flex-1 rounded-xl bg-[#F4A261] py-4 font-semibold text-black transition-colors hover:bg-white flex items-center justify-center gap-2">
                                <Play size={20} fill="black" />
                                Tonton Trailer
                            </button>
                            
                            <button 
                                onClick={() => onWatchlistAction && onWatchlistAction(movie)}
                                className="flex-1 rounded-xl border border-white/30 py-4 font-semibold transition-colors hover:border-white">
                                {watchlistActionLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
