import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Bar, Radar } from "react-chartjs-2";
import Head from "next/head";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import PokeDropdown from "@/components/PokeDropdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

interface Pokemon {
  name: string;
  image: string;
  stats: { name: string; value: number }[];
  types: string[];
}

export default function ComparePage() {
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [winner, setWinner] = useState<"pokemon1" | "pokemon2" | "draw" | null>(
    null
  );

  useEffect(() => {
    const fetchList = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();
      setPokemonList(data.results.map((p: any) => p.name));
    };
    fetchList();
  }, []);

  const fetchPokemon = async (name: string): Promise<Pokemon> => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    return {
      name: data.name,
      image: data.sprites.front_default,
      stats: data.stats.map((s: any) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      types: data.types.map((t: any) => t.type.name),
    };
  };

  const handleCompare = async () => {
    if (!selected1 || !selected2 || selected1 === selected2) return;
    const [p1, p2] = await Promise.all([
      fetchPokemon(selected1),
      fetchPokemon(selected2),
    ]);
    setPokemon1(p1);
    setPokemon2(p2);
    setWinner(null);
  };

  const handleBattle = () => {
    if (!pokemon1 || !pokemon2) return;
    const total1 = pokemon1.stats.reduce((sum, s) => sum + s.value, 0);
    const total2 = pokemon2.stats.reduce((sum, s) => sum + s.value, 0);
    if (total1 > total2) setWinner("pokemon1");
    else if (total2 > total1) setWinner("pokemon2");
    else setWinner("draw");
  };

  return (
    <>
      <Head>
        <title>Compare Pokemon</title>
        <link rel="icon" href="/pokeball.png" />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100 p-6 text-center relative">
        <div className="absolute inset-0 opacity-10 bg-[url('/pokeball-bg.svg')] bg-no-repeat bg-center bg-contain pointer-events-none z-0" />

        <h1 className="text-5xl font-pokemon text-yellow-500 drop-shadow-lg mb-6 z-10 relative">
          ⚔ Compare Pokémon
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 z-10 relative">
          <PokeDropdown
            label="Choose Pokémon 1"
            value={selected1}
            options={pokemonList}
            onChange={setSelected1}
          />

          <span className="font-bold text-xl text-gray-500 hidden md:block">
            VS
          </span>

          <PokeDropdown
            label="Choose Pokémon 2"
            value={selected2}
            options={pokemonList}
            onChange={setSelected2}
          />

          <button
            onClick={handleCompare}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-full shadow-md transition transform hover:scale-105"
          >
            ⚔ Compare
          </button>
        </div>

        {pokemon1 && pokemon2 && (
          <>
            <button
              onClick={handleBattle}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow transition"
            >
              ⚔ Simulate Battle
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[pokemon1, pokemon2].map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 shadow-md border-4 border-yellow-300 hover:border-red-400 hover:shadow-lg transform hover:scale-105 transition duration-300"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={96}
                    height={96}
                    className="mx-auto"
                  />
                  <h2 className="text-xl font-bold capitalize text-blue-900 mt-2">
                    {p.name}
                  </h2>
                  <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    {p.types.map((type) => (
                      <span
                        key={type}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1 text-left">
                    {p.stats.map((stat) => (
                      <div key={stat.name}>
                        <p className="text-sm capitalize text-gray-700">
                          {stat.name}
                        </p>
                        <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-3"
                            style={{ width: `${Math.min(stat.value, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-right text-gray-500">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {winner && (
              <div className="mt-8 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto text-center">
                {winner === "draw" ? (
                  <h2 className="text-xl font-bold text-gray-700">
                    🤝 It's a draw! Both Pokémon are equally strong!
                  </h2>
                ) : (
                  <h2 className="text-2xl font-extrabold text-green-600 animate-bounce">
                    🎉{" "}
                    {winner === "pokemon1"
                      ? pokemon1?.name.toUpperCase()
                      : pokemon2?.name.toUpperCase()}{" "}
                    Wins the Battle!
                  </h2>
                )}
                <button
                  onClick={() => setWinner(null)}
                  className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 py-2 rounded-full shadow transition"
                >
                  🔁 Rematch
                </button>
              </div>
            )}

            <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                📊 Stats Comparison
              </h2>
              <Bar
                data={{
                  labels: pokemon1.stats.map((s) => s.name.toUpperCase()),
                  datasets: [
                    {
                      label: pokemon1.name.toUpperCase(),
                      data: pokemon1.stats.map((s) => s.value),
                      backgroundColor: "rgba(59, 130, 246, 0.6)",
                    },
                    {
                      label: pokemon2.name.toUpperCase(),
                      data: pokemon2.stats.map((s) => s.value),
                      backgroundColor: "rgba(251, 191, 36, 0.6)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 20 },
                    },
                  },
                }}
              />
            </div>

            <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                🧽 Stat Radar
              </h2>
              <Radar
                data={{
                  labels: pokemon1.stats.map((s) => s.name.toUpperCase()),
                  datasets: [
                    {
                      label: pokemon1.name.toUpperCase(),
                      data: pokemon1.stats.map((s) => s.value),
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      borderColor: "rgba(59, 130, 246, 1)",
                      borderWidth: 2,
                      pointBackgroundColor: "rgba(59, 130, 246, 1)",
                    },
                    {
                      label: pokemon2.name.toUpperCase(),
                      data: pokemon2.stats.map((s) => s.value),
                      backgroundColor: "rgba(251, 191, 36, 0.2)",
                      borderColor: "rgba(251, 191, 36, 1)",
                      borderWidth: 2,
                      pointBackgroundColor: "rgba(251, 191, 36, 1)",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    r: {
                      angleLines: { color: "#e5e7eb" },
                      grid: { color: "#e5e7eb" },
                      pointLabels: {
                        font: { size: 12, weight: "bold" },
                        color: "#374151",
                      },
                      ticks: {
                        backdropColor: "transparent",
                        color: "#6b7280",
                        stepSize: 20,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        font: { size: 14 },
                        color: "#374151",
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
