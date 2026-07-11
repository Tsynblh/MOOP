"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import MovieModal from "@/components/MovieModal";
import { Movie, MovieDetails } from "@/types/movie";
import { getTrendingMovies, getMovieById } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";

interface NoticeState {
    title: string;
    message: string;
}

export default function Home() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState<NoticeState | null>(null);
    const [heroMovieIndex, setHeroMovieIndex] = useState(0);
    const [previousHeroMovieIndex, setPreviousHeroMovieIndex] = useState<number | null>(null);
    const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);
    const [isHeroFadingIn, setIsHeroFadingIn] = useState(false);
    const { addToWatchlist } = useWatchlist();
    const heroMovies = movies.filter((movie) => movie.backdrop_path);
    

    useEffect(() => {
        async function fetchMovies() {
            try {
                const data = await getTrendingMovies();
                setMovies(data.results || []);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    useEffect(() => {
        if (heroMovies.length <= 1) return;

        const intervalId = window.setInterval(() => {
            setHeroMovieIndex((currentIndex) => {
                setPreviousHeroMovieIndex(currentIndex);
                setIsHeroTransitioning(true);
                setIsHeroFadingIn(false);
                return (currentIndex + 1) % heroMovies.length;
            });
        }, 60000);

        return () => window.clearInterval(intervalId);
    }, [heroMovies.length]);

    useEffect(() => {
        if (!isHeroTransitioning) return;

        const frameId = window.requestAnimationFrame(() => {
            setIsHeroFadingIn(true);
        });

        const timeoutId = window.setTimeout(() => {
            setIsHeroTransitioning(false);
            setIsHeroFadingIn(false);
            setPreviousHeroMovieIndex(null);
        }, 1200);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(timeoutId);
        };
    }, [isHeroTransitioning]);

    const normalizedHeroMovieIndex = heroMovies.length > 0 ? heroMovieIndex % heroMovies.length : 0;
    const currentHeroMovie = heroMovies[normalizedHeroMovieIndex] || movies[0];
    const previousHeroMovie =
        previousHeroMovieIndex !== null && heroMovies.length > 0
            ? heroMovies[previousHeroMovieIndex % heroMovies.length]
            : null;

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

    const closeNotice = () => {
        setNotice(null);
    };

    const openLoginModal = () => {
        closeNotice();
        window.dispatchEvent(new Event("open-auth-modal"));
    };

    const handleAddToWatchlist = async (movie: MovieDetails) => {
        const result = await addToWatchlist(movie);

        if (result === "added") {
            setNotice({
                title: "Berhasil Ditambahkan",
                message: `"${movie.title}" telah ditambahkan ke watchlist.`,
            });
            return;
        }

        if (result === "exists") {
            setNotice({
                title: "Sudah Ada di Watchlist",
                message: `"${movie.title}" sudah ada di watchlist kamu.`,
            });
            return;
        }

        if (result === "unauthenticated") {
            setNotice({
                title: "Login Dulu",
                message: "Silakan login terlebih dahulu untuk menambahkan film ke watchlist.",
            });
            return;
        }

        if (result === "error") {
            setNotice({
                title: "Gagal Menyimpan",
                message: "Terjadi kesalahan saat menambahkan film ke watchlist.",
            });
        }
    };

    return (
        <main className="min-h-screen bg-[#0F0F0F]">
            <Navbar onMovieSelect={openMovieModal} />

            <div className="pb-12 pt-32 sm:pt-36 lg:pt-24">
                {/* Hero Section */}
                <div className="relative flex min-h-[60vh] items-center overflow-hidden bg-black sm:min-h-[65vh] lg:min-h-[70vh]">
                    {currentHeroMovie && (
                        <div className="absolute inset-0">
                            {previousHeroMovie && isHeroTransitioning && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-linear"
                                    style={{
                                        backgroundImage: `url(https://image.tmdb.org/t/p/original${previousHeroMovie.backdrop_path})`,
                                        opacity: isHeroFadingIn ? 0 : 0.6,
                                    }}
                                />
                            )}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-linear"
                                style={{
                                    backgroundImage: `url(https://image.tmdb.org/t/p/original${currentHeroMovie.backdrop_path})`,
                                    opacity: isHeroTransitioning ? (isHeroFadingIn ? 0.6 : 0) : 0.6,
                                }}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent"></div>
                        </div>
                    )}

                    <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
                        <h1 className="heading-font mb-4 text-4xl font-bold leading-none sm:text-5xl md:text-6xl lg:text-7xl">
                            Discover Movies
                        </h1>
                        <p className="mb-8 max-w-lg text-base text-gray-300 sm:text-lg md:text-xl">
                            Temukan film favoritmu, simpan di watchlist, dan dapatkan rekomendasi terbaik.
                        </p>
                    </div>
                </div>

                {/* Trending Section */}
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
                    <h2 className="heading-font mb-8 text-2xl font-semibold sm:text-3xl">Trending Now</h2>

                    {loading ? (
                        <p className="text-gray-400">Loading movies...</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
                            {movies.slice(0, 10).map((movie) => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={movie} 
                                    onClick={openMovieModal}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Movie Modal */}
            <MovieModal 
                movie={selectedMovie} 
                isOpen={isModalOpen} 
                onClose={closeModal}
                onWatchlistAction={handleAddToWatchlist} 
            />

            {notice && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4"
                    onClick={closeNotice}
                >
                    <div
                        className="w-full max-w-md rounded-3xl bg-[#1A1A1A] p-6 text-center shadow-2xl sm:p-8"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="heading-font mb-4 text-2xl font-bold sm:text-3xl">{notice.title}</h3>
                        <p className="mb-6 text-sm leading-relaxed text-gray-300 sm:text-base">{notice.message}</p>
                        {notice.title === "Login Dulu" ? (
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={openLoginModal}
                                    className="flex-1 rounded-2xl bg-[#F4A261] py-4 font-semibold text-black transition-colors hover:bg-white"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={closeNotice}
                                    className="flex-1 rounded-2xl border border-white/20 py-4 font-semibold text-white transition-colors hover:border-white"
                                >
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={closeNotice}
                                className="w-full rounded-2xl bg-[#F4A261] py-4 font-semibold text-black transition-colors hover:bg-white"
                            >
                                Oke
                            </button>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
