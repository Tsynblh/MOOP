"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        Promise.resolve().then(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
            setMounted(true);
        });
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        const nextIsDark = !root.classList.contains("dark");
        root.classList.toggle("dark", nextIsDark);
        localStorage.setItem("theme", nextIsDark ? "dark" : "light");
        setIsDark(nextIsDark);
    };

    if (!mounted) {
        return <div className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />;
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Aktifkan light mode" : "Aktifkan dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text)] ring-1 ring-[var(--border)] transition-all hover:bg-[var(--surface-2)] sm:h-10 sm:w-10"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
