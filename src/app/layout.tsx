import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moop - Movie Operation",
  description: "Discover and save your favorite movies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className="bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var storedTheme = localStorage.getItem("theme");
                var theme = storedTheme || "dark";
                document.documentElement.classList.toggle("dark", theme === "dark");
              } catch (error) {}
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
