import Link from "next/link";
import Image from "next/image";

interface Props {
  pokemon: {
    name: string;
    image: string;
    id?: number;
    types?: string[];
  };
}

const typeColorMap: Record<string, string> = {
  fire: "border-red-400",
  water: "border-blue-400",
  grass: "border-green-400",
  electric: "border-yellow-400",
  bug: "border-lime-400",
  poison: "border-purple-400",
  ground: "border-yellow-500",
  fairy: "border-pink-400",
  flying: "border-indigo-400",
  normal: "border-gray-300",
  fighting: "border-orange-400",
  psychic: "border-pink-500",
  rock: "border-yellow-600",
  ice: "border-cyan-400",
  dragon: "border-indigo-600",
  ghost: "border-purple-600",
  dark: "border-gray-700",
  steel: "border-gray-400",
};

export default function PokemonCard({ pokemon }: Props) {
  const mainType = pokemon.types?.[0] || "normal";
  const borderColor = typeColorMap[mainType] || "border-gray-300";

  return (
    <Link href={`/pokemon/${pokemon.name}`}>
      <div
        className={`group bg-gradient-to-br from-yellow-50 via-white to-red-100 rounded-3xl p-5 border-4 ${borderColor} shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 text-center cursor-pointer hover:animate-wiggle`}
      >
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .float {
            animation: float 3s ease-in-out infinite;
          }

          @keyframes wiggle {
            0%,
            100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(1deg);
            }
            75% {
              transform: rotate(-1deg);
            }
          }
          .animate-wiggle {
            animation: wiggle 0.3s ease-in-out;
          }
        `}</style>

        {/* Image */}
        <div className="relative w-24 h-24 mx-auto mb-2 float">
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* ID */}
        {pokemon.id && (
          <p className="text-xs text-gray-500 font-mono">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        )}

        <p className="capitalize font-extrabold text-sm sm:text-lg text-blue-900 group-hover:text-red-600 transition drop-shadow-sm tracking-wide break-words">
          {pokemon.name}
        </p>

        {/* Types */}
        {pokemon.types && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm capitalize ${
                  {
                    fire: "bg-red-200 text-red-800",
                    water: "bg-blue-200 text-blue-800",
                    grass: "bg-green-200 text-green-800",
                    electric: "bg-yellow-200 text-yellow-800",
                    bug: "bg-lime-200 text-lime-800",
                    poison: "bg-purple-200 text-purple-800",
                    ground: "bg-yellow-300 text-yellow-900",
                    fairy: "bg-pink-200 text-pink-800",
                    flying: "bg-indigo-200 text-indigo-800",
                    normal: "bg-gray-200 text-gray-800",
                    fighting: "bg-orange-300 text-orange-900",
                    psychic: "bg-pink-300 text-pink-900",
                    rock: "bg-yellow-400 text-yellow-900",
                    ice: "bg-cyan-200 text-cyan-900",
                    dragon: "bg-indigo-400 text-white",
                    ghost: "bg-purple-600 text-white",
                    dark: "bg-gray-700 text-white",
                    steel: "bg-gray-300 text-gray-900",
                  }[type] || "bg-gray-200 text-gray-800"
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
