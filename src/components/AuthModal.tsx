"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) alert(error.message);
                else onClose();
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) alert(error.message);
                else alert("Cek email kamu untuk konfirmasi akun!");
            }
        } catch {
            alert("Terjadi kesalahan");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
            <div 
                className="bg-[#1A1A1A] p-10 rounded-3xl w-full max-w-md"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="heading-font text-4xl font-bold mb-8 text-center">
                    {isLogin ? "Login" : "Daftar"}
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0F0F0F] p-4 rounded-2xl mb-4 text-lg"
                />
                <div className="relative mb-8">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0F0F0F] p-4 pr-14 rounded-2xl text-lg"
                    />
                    <button
                        type="button"
                        aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <button 
                    onClick={handleAuth}
                    disabled={loading}
                    className="w-full bg-[#F4A261] hover:bg-white text-black py-4 rounded-2xl font-semibold text-lg transition-all mb-6"
                >
                    {loading ? "Loading..." : isLogin ? "Login" : "Daftar"}
                </button>

                <p className="text-center text-gray-400">
                    {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
                    <span 
                        className="text-[#F4A261] cursor-pointer hover:underline" 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Daftar" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}
