"use client";

import { useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { WatchlistMovie } from "@/hooks/useWatchlist";
import MovieModal from "@/components/MovieModal";
import { getMovieById } from "@/lib/tmdb";
import { Movie, MovieDetails } from "@/types/movie";
import Link from "next/link";

export default function WatchlistPage() {
    const { watchlist, loading, isAuthenticated, removeFromWatchlist } = useWatchlist();
    const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openMovieModal = async (movie: Movie) => {
        try {
            const details = await getMovieById(movie.id.toString());
            setSelectedMovie(details);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    };

    const handleRemoveFromWatchlist = async (movie: MovieDetails) => {
        await removeFromWatchlist(movie.id);
        closeModal();
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F]">
            <Navbar onMovieSelect={() => {}} />
            <div className="mx-auto max-w-7xl px-4 pt-32 sm:px-6 sm:pt-36 lg:pt-24">
                <h1 className="heading-font mb-8 text-3xl font-bold sm:mb-10 sm:text-4xl">My Watchlist</h1>

                {loading ? (
                    <p className="text-gray-400">Loading watchlist...</p>
                ) : !isAuthenticated ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#1A1A1A] px-6 py-12 text-center sm:px-8 sm:py-16">
                        <p className="heading-font text-2xl font-bold text-white sm:text-3xl">Login untuk melihat watchlist</p>
                        <p className="mt-4 text-base text-gray-400 sm:text-lg">
                            Kamu sedang logout. Klik ikon profil di kanan atas untuk login, lalu akses lagi watchlist kamu.
                        </p>
                        <Link
                            href="/"
                            className="mt-8 inline-flex rounded-2xl bg-[#F4A261] px-6 py-4 font-semibold text-black transition-colors hover:bg-white sm:px-8"
                        >
                            Kembali ke Homepage
                        </Link>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-400">Watchlist kamu masih kosong</p>
                        <p className="text-gray-500 mt-4">Tambahkan film favoritmu dari homepage</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
                        {watchlist.map((movie: WatchlistMovie) => (
                            <MovieCard key={movie.movie_id} movie={movie} onClick={openMovieModal} />
                        ))}
                    </div>
                )}
            </div>

            <MovieModal
                movie={selectedMovie}
                isOpen={isModalOpen}
                onClose={closeModal}
                onWatchlistAction={handleRemoveFromWatchlist}
                watchlistActionLabel="Hapus dari Watchlist"
            />
        </main>
    );
}
