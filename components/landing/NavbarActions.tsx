"use client";

import Link from "next/link";
import { trackClick } from "@/lib/utils/analytics-hits";

export function NavbarActions({ user }: { user: any }) {
  if (user) {
    return (
      <Link
        href="/dashboard"
        onClick={() => trackClick("/dashboard")}
        className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-600/20"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link 
        href="/login" 
        onClick={() => trackClick("/login")}
        className="text-white text-sm font-bold hover:text-purple-400 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={() => trackClick("/register")}
        className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all shadow-lg"
      >
        Join Now
      </Link>
    </>
  );
}
