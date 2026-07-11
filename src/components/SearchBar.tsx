"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { searchMovies } from "@/lib/tmdb";

interface SearchBarProps {
    onMovieSelect: (movie: Movie) => void;
}

export default function SearchBar({ onMovieSelect }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const data = await searchMovies(query);
                setResults(data.results?.slice(0, 8) || []);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="relative w-full">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        const nextQuery = e.target.value;
                        setQuery(nextQuery);
                        setShowResults(nextQuery.length >= 2);

                        if (nextQuery.length < 2) {
                            setResults([]);
                        }
                    }}
                    placeholder="Cari film, aktor, atau genre..."
                    className="w-full rounded-2xl bg-[#1A1A1A] py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F4A261] sm:py-3.5 sm:pl-12 sm:text-base"
                />
            </div>

            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-[60vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-2xl">
                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => {
                                onMovieSelect(movie);
                                setQuery("");
                                setShowResults(false);
                            }}
                            className="flex cursor-pointer items-center gap-3 border-b border-white/5 px-3 py-3 hover:bg-white/10 last:border-none sm:gap-4 sm:px-4"
                        >
                            <img 
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                alt={movie.title}
                                className="h-14 w-10 rounded object-cover sm:h-16 sm:w-12"
                            />
                            <div className="min-w-0">
                                <p className="truncate font-medium">{movie.title}</p>
                                <p className="text-sm text-gray-400">{movie.release_date?.substring(0, 4)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
