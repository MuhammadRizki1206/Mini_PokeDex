import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-blue-100 flex flex-col justify-center items-center text-center p-6">
      {/* Pokéball background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/pokeball-bg.svg')] bg-no-repeat bg-center bg-contain z-0" />

      {/* Pikachu Image */}
      <div className="relative w-40 h-40 mb-6 z-10">
        <Image
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="pikachu"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-red-600 mb-4 drop-shadow z-10">
        404 - Pokémon Not Found!
      </h1>

      <p className="text-lg text-gray-700 mb-6 z-10">
        Oops! Looks like you're trying to catch a Pokémon that doesn't exist. 🕵️‍♂️
      </p>

      {/* Go Back Home */}
      <Link href="/">
        <span className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition z-10 cursor-pointer">
          🔙 Back to Pokédex
        </span>
      </Link>
    </div>
  );
}
