import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {ReactNode} from "react";

import {ApiProvider} from "@/context/ApiContext";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pixel Battle 🎨",
    description: "Join the ultimate Pixel Battle! Draw, paint, and conquer the canvas in real-time with players worldwide. Built with Next.js and FastAPI backend.",
    keywords: ["pixel battle", "pixel art", "real-time game", "Next.js", "FastAPI", "multiplayer", "art"],
    authors: [
        {name: "Zebaro", url: "https://github.com/Zebaro24"},
        {name: "WhiteDH", url: "https://github.com/WhiteDH"},
    ],
    openGraph: {
        title: "Pixel Battle 🎨",
        description: "Real-time multiplayer pixel canvas where every pixel counts.",
        url: "https://pixel-battle.zebaro.dev/",
        siteName: "Pixel Battle",
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({children,}: Readonly<{ children: ReactNode; }>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-tr from-blue-400 to-purple-500`}
        >
        <ApiProvider>
            {children}
        </ApiProvider>
        </body>
        </html>
    );
}
