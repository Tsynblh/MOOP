"use client";

import Link from "next/link";
import { Heart, User, LogOut } from "lucide-react";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "./AuthModal";
import { Movie } from "@/types/movie";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
    onMovieSelect: (movie: Movie) => void;
}

export default function Navbar({ onMovieSelect }: NavbarProps) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [showAuth, setShowAuth] = useState(false);

    const profileName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email ||
        "User";
    const profileInitial = profileName.trim().charAt(0).toUpperCase();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const openAuthModal = () => {
            setShowAuth(true);
        };

        window.addEventListener("open-auth-modal", openAuthModal);

        return () => {
            window.removeEventListener("open-auth-modal", openAuthModal);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center justify-between gap-3">
                        <Link href="/" className="flex shrink-0 items-center gap-3">
                            <img src="/logo.png" alt="Moop Logo" className="h-10 w-auto sm:h-12" />
                        {/* <h1 className="heading-font text-3xl font-bold tracking-tighter">MOOP</h1> */}
                        </Link>

                        <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
                            <Link href="/watchlist" className="flex items-center gap-2 transition-colors hover:text-[#F4A261]">
                                <Heart size={22} />
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4A261] text-sm font-semibold text-black sm:h-10 sm:w-10 sm:text-base"
                                        aria-label={`Profil ${profileName}`}
                                        title={profileName}
                                    >
                                        {profileInitial}
                                    </div>
                                    <button onClick={handleLogout} className="text-red-400 hover:text-red-500">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1A1A] transition-all hover:bg-[#F4A261] hover:text-black"
                                >
                                    <User size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:flex md:justify-center lg:mx-8 lg:max-w-2xl lg:flex-1 lg:justify-start">
                        <SearchBar onMovieSelect={onMovieSelect} />
                    </div>

                    <div className="hidden items-center justify-end gap-6 lg:flex">
                        <Link href="/watchlist" className="flex items-center gap-2 transition-colors hover:text-[#F4A261]">
                            <Heart size={24} />
                            <span className="font-medium">Watchlist</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-[#F4A261] text-black flex items-center justify-center font-semibold text-base"
                                    aria-label={`Profil ${profileName}`}
                                    title={profileName}
                                >
                                    {profileInitial}
                                </div>
                                <button onClick={handleLogout} className="text-red-400 hover:text-red-500">
                                    <LogOut size={22} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowAuth(true)}
                                className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#F4A261] hover:text-black transition-all"
                            >
                                <User size={22} />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </>
    );
}
