import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner";

interface EvolutionItem {
  name: string;
  image: string;
  level?: number;
}

export default function PokemonDetail() {
  const router = useRouter();
  const { name } = router.query;
  const [pokemon, setPokemon] = useState<any>(null);
  const [evolution, setEvolution] = useState<EvolutionItem[]>([]);
  const [flavor, setFlavor] = useState<string>("");
  const [species, setSpecies] = useState<any>(null);

  const typeColorMap: Record<string, string> = {
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
  };

  useEffect(() => {
    if (!name) return;

    const fetchPokemon = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      setSpecies(speciesData);

      const flavorText = speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === "en"
      );
      setFlavor(flavorText?.flavor_text.replace(/\f/g, " ") || "");

      const evoRes = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoRes.json();

      const evoList: EvolutionItem[] = [];
      let evo = evoData.chain;
      while (evo) {
        const evoName = evo.species.name;
        const evoDetailRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${evoName}`
        );
        const evoDetail = await evoDetailRes.json();
        evoList.push({
          name: evoName,
          image: evoDetail.sprites.front_default,
          level: evo.evolution_details?.[0]?.min_level || undefined,
        });
        evo = evo.evolves_to[0];
      }
      setEvolution(evoList);

      const cry = new Audio(
        `https://play.pokemonshowdown.com/audio/cries/${data.name}.mp3`
      );
      cry.volume = 0.3;
      cry.play().catch(() => {});
    };

    fetchPokemon();
  }, [name]);

  if (!pokemon || !species) {
    return (
      <>
        <Head>
          <title>Loading Pokémon...</title>
        </Head>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-yellow-100 to-blue-100">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const borderClass = typeColorMap[mainType] || "border-yellow-300";

  const maleRatio = (8 - species.gender_rate) / 8;
  const femaleRatio = species.gender_rate / 8;

  return (
    <>
      <Head>
        <title>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </title>

        <link rel="icon" href="/pokeball.png" />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-blue-100 p-4 sm:p-6">
        <div
          className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-4 sm:p-6 border-4 ${borderClass}`}
        >
          <h1 className="text-2xl sm:text-4xl capitalize font-bold text-center text-red-600 drop-shadow mb-4">
            {pokemon.name}
          </h1>

          <div className="flex justify-center mb-6">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt={pokemon.name}
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
          </div>

          {flavor && (
            <blockquote className="italic text-gray-600 mt-2 mb-4 bg-yellow-50 border-l-4 border-yellow-300 pl-4 py-2 rounded text-sm sm:text-base">
              {flavor}
            </blockquote>
          )}

          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Types
          </h2>
          <div className="flex gap-2 mb-4 flex-wrap">
            {pokemon.types.map((t: any) => (
              <span
                key={t.type.name}
                className={`px-3 py-1 text-xs sm:text-sm font-medium capitalize rounded-full shadow-sm ${
                  typeColorMap[t.type.name] || "bg-gray-200 text-gray-800"
                }`}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            📖 About
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm text-gray-800 mb-6">
            <li>
              <strong>Height:</strong> {pokemon.height / 10} m
            </li>
            <li>
              <strong>Weight:</strong> {pokemon.weight / 10} kg
            </li>
            <li>
              <strong>Base Exp:</strong> {pokemon.base_experience}
            </li>
            <li>
              <strong>Abilities:</strong>{" "}
              {pokemon.abilities.map((a: any) => a.ability.name).join(", ")}
            </li>
            <li>
              <strong>Habitat:</strong>{" "}
              {species.habitat?.name
                ? species.habitat.name.charAt(0).toUpperCase() +
                  species.habitat.name.slice(1)
                : "Unknown"}
            </li>
            <li>
              <strong>Gender Ratio:</strong> ♂️ {(maleRatio * 100).toFixed(0)}%
              / ♀️ {(femaleRatio * 100).toFixed(0)}%
            </li>
            <li>
              <strong>Egg Groups:</strong>{" "}
              {species.egg_groups.map((g: any) => g.name).join(", ")}
            </li>
            <li>
              <strong>Catch Rate:</strong> {species.capture_rate} (
              {Math.round((species.capture_rate / 255) * 100)}%)
            </li>
          </ul>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Stats
          </h2>
          <div className="space-y-3 mb-6">
            {pokemon.stats.map((s: any) => (
              <div key={s.stat.name}>
                <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                  <span className="capitalize">{s.stat.name}</span>
                  <span>{s.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(s.base_stat, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Moves
          </h2>
          <ul className="text-xs sm:text-sm text-gray-700 mb-6 grid grid-cols-2 gap-x-4 list-disc list-inside">
            {pokemon.moves.slice(0, 10).map((m: any) => (
              <li key={m.move.name} className="capitalize">
                {m.move.name}
              </li>
            ))}
          </ul>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Evolution Chain
          </h2>
          <div className="flex flex-wrap gap-6 justify-center mb-6">
            {evolution.map((evo) => (
              <div
                key={evo.name}
                className="text-center hover:scale-105 transition transform"
              >
                <img
                  src={evo.image}
                  alt={evo.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                />
                <p className="capitalize font-medium text-gray-700 mt-1 text-xs sm:text-sm">
                  {evo.name}
                </p>
                {evo.level && (
                  <p className="text-xs text-gray-500">Lvl {evo.level}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              🔙 Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
