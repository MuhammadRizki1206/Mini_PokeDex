import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) =>
    router.pathname === path ? "text-red-500 font-bold" : "text-blue-900";

  return (
    <nav className="bg-gradient-to-r from-yellow-200 to-blue-200 shadow-md py-3 px-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-red-600 drop-shadow-sm">
        Mini PokéDex
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-6 text-lg">
        <Link href="/" className={isActive("/")}>
          Home
        </Link>
        <Link href="/compare" className={isActive("/compare/compare")}>
          Compare
        </Link>
        <Link href="/battle" className={isActive("/battle/battle")}>
          Battle
        </Link>
        <Link href="/game/guess" className={isActive("/game/guess")}>
          Game
        </Link>
      </div>

      {/* Mobile button */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="text-blue-900 font-bold"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col text-center z-50 md:hidden">
          <Link
            href="/"
            className="py-2 border-b z-0"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/compare"
            className="py-2 border-b z-0"
            onClick={() => setOpen(false)}
          >
            Compare
          </Link>
          <Link
            href="/battle"
            className="py-2 border-b"
            onClick={() => setOpen(false)}
          >
            Battle
          </Link>
          <Link
            href="/game/guess"
            className="py-2"
            onClick={() => setOpen(false)}
          >
            Game
          </Link>
        </div>
      )}
    </nav>
  );
}
