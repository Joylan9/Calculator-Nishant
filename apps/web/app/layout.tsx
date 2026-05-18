import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Calci — Premium Calculator",
  description: "A cinematic, production-grade calculator with precision arithmetic, stunning animations, and scientific mode. Built with Next.js, Three.js, and Framer Motion.",
  keywords: ["calculator", "scientific calculator", "premium", "math", "precision"],
  openGraph: {
    title: "Calci — Premium Calculator",
    description: "Calculate with elegance. Precision arithmetic meets cinematic design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="obsidian">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
