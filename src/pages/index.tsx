import { useEffect, useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import SearchBar from "@/components/SearchBar";
import FilterType from "@/components/FilterType";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner";
import Footer from "@/components/Footer";

interface Pokemon {
  name: string;
  url: string;
  image: string;
  types: string[];
}

export default function Home() {
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [filtered, setFiltered] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  // ✅ Ambil seluruh 151 Pokémon sekali di awal
  useEffect(() => {
    const fetchAllPokemons = async () => {
      setLoading(true);
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const detail = await res.json();
          return {
            name: pokemon.name,
            url: pokemon.url,
            image: detail.sprites.front_default,
            types: detail.types.map((t: any) => t.type.name),
          };
        })
      );

      setAllPokemons(pokemonDetails);
      setLoading(false);
    };

    fetchAllPokemons();
  }, []);

  // ✅ Filter berdasarkan search dan type
  useEffect(() => {
    let result = allPokemons;

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      result = result.filter((p) => p.types.includes(typeFilter));
    }

    setFiltered(result);
    setPage(1); // reset ke halaman 1 saat filter berubah
  }, [search, typeFilter, allPokemons]);

  // ✅ Pagination di frontend
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return (
    <>
      <Head>
        <title>Mini PokèDex</title>
        <link rel="icon" href="/pokeball.png" />
      </Head>

      <Navbar />

      <div className="px-4 py-6 bg-gradient-to-br from-yellow-100 via-white to-blue-100 min-h-screen relative overflow-hidden font-pokemon">
        {/* ✨ Inject Font */}
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

          .font-pokemon {
            font-family: "Press Start 2P", cursive;
          }

          .fade-in {
            animation: fadeIn 0.7s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/pokeball-bg.svg')] bg-no-repeat bg-center bg-contain" />

        {/* Logo */}
        <div className="w-full flex justify-center mb-4 mt-6">
          <Image
            src="/pokemon.png"
            alt="Pokemon Logo"
            width={200}
            height={80}
            className="drop-shadow-md"
          />
        </div>

        {/* Title
        <h1 className="text-lg sm:text-xl md:text-3xl font-extrabold text-center text-red-600 drop-shadow tracking-widest mb-6">
          Mini PokéDex
        </h1> */}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 justify-center items-center">
          <div className="flex items-center gap-2">
            <img
              src="/pokeball.png"
              alt="Pokeball Icon"
              className="w-5 h-5 animate-bounce"
            />
            <SearchBar search={search} setSearch={setSearch} />
          </div>
          <div className="flex items-center gap-2">
            <img
              src="/pokeball.png"
              alt="Pokeball Icon"
              className="w-5 h-5 animate-bounce"
            />
            <FilterType setTypeFilter={setTypeFilter} />
          </div>
        </div>

        {/* Loading / Result */}
        {loading ? (
          <div className="text-center text-gray-600 font-medium animate-pulse text-base sm:text-lg py-16">
            <LoadingSpinner />
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center text-gray-500 font-medium text-base sm:text-lg py-16">
            😢 No Pokémon found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 fade-in">
            {paginated.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          setPage={setPage}
          total={Math.ceil(filtered.length / limit)}
        />
        <Footer />
      </div>
    </>
  );
}
