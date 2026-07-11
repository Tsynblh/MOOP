"use client";

import Image from "next/image";
import { X, Star, Play } from "lucide-react";
import { MovieDetails } from "@/types/movie";
import { useEffect, useState } from "react";

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
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerNotice, setTrailerNotice] = useState<string | null>(null);
    const [loadingTrailer, setLoadingTrailer] = useState(false);

    useEffect(() => {
        Promise.resolve().then(() => {
            setTrailerKey(null);
            setShowTrailer(false);
            setTrailerNotice(null);
            setLoadingTrailer(false);
        });
    }, [movie?.id, isOpen]);

    const findYoutubeTrailer = (
        videos?: Array<{ type: string; site: string; key: string; official?: boolean }>
    ) => {
        if (!videos?.length) return null;

        return (
            videos.find(
                (video) => video.type === "Trailer" && video.site === "YouTube" && video.official
            ) ||
            videos.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
            videos.find((video) => video.site === "YouTube") ||
            null
        );
    };

    const closeTrailerModal = () => {
        setShowTrailer(false);
        setTrailerKey(null);
    };

    if (!movie || !isOpen) return null;

    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : "/placeholder.jpg";

    const playTrailer = async () => {
        setLoadingTrailer(true);
        setTrailerNotice(null);

        try {
            const existingTrailer = findYoutubeTrailer(movie.videos?.results);

            if (existingTrailer) {
                setTrailerKey(existingTrailer.key);
                setShowTrailer(true);
                return;
            }

            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );

            if (!res.ok) {
                throw new Error("Failed to fetch trailer");
            }

            const data = await res.json();

            const trailer = findYoutubeTrailer(data.results);

            if (trailer) {
                setTrailerKey(trailer.key);
                setShowTrailer(true);
            } else {
                setTrailerNotice("Trailer tidak tersedia untuk film ini.");
            }
        } catch {
            setTrailerNotice("Gagal memuat trailer. Coba lagi nanti.");
        } finally {
            setLoadingTrailer(false);
        }
    };

    return (
        <>
            {/* Main Modal */}
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 p-3 backdrop-blur-md sm:p-4 md:flex md:items-center md:justify-center" onClick={onClose}>
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
                                <button 
                                    type="button"
                                    onClick={playTrailer}
                                    disabled={loadingTrailer}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-4 font-semibold text-black transition-colors ${
                                        loadingTrailer
                                            ? "cursor-not-allowed bg-[#F4A261]/70"
                                            : "bg-[#F4A261] hover:bg-white"
                                    }`}
                                >
                                    <Play size={20} fill="black" />
                                    {loadingTrailer ? "Memuat Trailer..." : "Tonton Trailer"}
                                </button>
                                
                                <button 
                                    onClick={() => onWatchlistAction && onWatchlistAction(movie)}
                                    className="flex-1 rounded-xl border border-white/30 py-4 font-semibold transition-colors hover:border-white"
                                >
                                    {watchlistActionLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && trailerKey && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4" onClick={closeTrailerModal}>
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black" onClick={e => e.stopPropagation()}>
                        <button 
                            type="button"
                            onClick={closeTrailerModal}
                            className="absolute -top-12 right-4 text-white text-lg hover:text-gray-300"
                        >
                            ✕ Tutup
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                                title={`Trailer ${movie.title}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            {trailerNotice && (
                <div
                    className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 px-4"
                    onClick={() => setTrailerNotice(null)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-[#1A1A1A] p-6 text-center shadow-2xl sm:p-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="heading-font mb-4 text-2xl font-bold sm:text-3xl">
                            Trailer Tidak Tersedia
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                            {trailerNotice}
                        </p>
                        <button
                            type="button"
                            onClick={() => setTrailerNotice(null)}
                            className="w-full rounded-2xl bg-[#F4A261] py-4 font-semibold text-black transition-colors hover:bg-white"
                        >
                            Oke
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
