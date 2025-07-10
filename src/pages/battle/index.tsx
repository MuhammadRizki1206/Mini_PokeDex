import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Footer from "@/components/Footer";

interface Pokemon {
  name: string;
  image: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export default function BattlePage() {
  const [pokemonList, setPokemonList] = useState<string[]>([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState<"p1" | "p2">("p1");
  const [winAudio, setWinAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();
      setPokemonList(data.results.map((p: any) => p.name));
    };
    fetchList();
  }, []);

  useEffect(() => {
    if (winner) {
      const audio = new Audio("/win-sound.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
      setWinAudio(audio); // simpan referensinya
    }
  }, [winner]);

  useEffect(() => {
    return () => {
      // Cleanup win sound jika masih nyala saat keluar dari halaman
      if (winAudio) {
        winAudio.pause();
        winAudio.currentTime = 0;
      }
    };
  }, [winAudio]);

  const fetchPokemon = async (name: string): Promise<Pokemon> => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();
    const stats = data.stats.reduce((acc: any, s: any) => {
      acc[s.stat.name] = s.base_stat;
      return acc;
    }, {});
    return {
      name: data.name,
      image: data.sprites.front_default,
      stats: {
        hp: stats.hp,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
      },
    };
  };

  const startBattle = async () => {
    if (!selected1 || !selected2 || selected1 === selected2) return;
    const [p1, p2] = await Promise.all([
      fetchPokemon(selected1),
      fetchPokemon(selected2),
    ]);
    setPokemon1(p1);
    setPokemon2(p2);
    setHp1(p1.stats.hp * 2);
    setHp2(p2.stats.hp * 2);
    setWinner("");
    setLog([]);
    setTurn(p1.stats.speed >= p2.stats.speed ? "p1" : "p2");
  };

  const attack = () => {
    if (!pokemon1 || !pokemon2 || winner) return;

    // 🔊 Play attack sound
    const sound = new Audio("/attack-sound.mp3");
    sound.volume = 0.5;
    sound.play().catch(() => {});

    let attacker, defender, setDefenderHp, currentHp, defenderName;
    if (turn === "p1") {
      attacker = pokemon1;
      defender = pokemon2;
      setDefenderHp = setHp2;
      currentHp = hp2;
      defenderName = pokemon2.name;
    } else {
      attacker = pokemon2;
      defender = pokemon1;
      setDefenderHp = setHp1;
      currentHp = hp1;
      defenderName = pokemon1.name;
    }

    const damage = Math.max(
      5,
      Math.floor(attacker.stats.attack - defender.stats.defense / 2)
    );
    const newHp = Math.max(0, currentHp - damage);
    setDefenderHp(newHp);
    setLog((prev) => [
      `${attacker.name.toUpperCase()} attacked ${defenderName.toUpperCase()} for ${damage} damage!`,
      ...prev,
    ]);
    if (newHp <= 0) {
      setWinner(attacker.name.toUpperCase());
    } else {
      setTurn(turn === "p1" ? "p2" : "p1");
    }
  };

  const reset = () => {
    if (winAudio) {
      winAudio.pause();
      winAudio.currentTime = 0;
      setWinAudio(null); // clear dari state
    }

    setSelected1("");
    setSelected2("");
    setPokemon1(null);
    setPokemon2(null);
    setHp1(0);
    setHp2(0);
    setLog([]);
    setWinner("");
    setTurn("p1");
  };

  return (
    <>
      <Head>
        <title>Battle Pokemon</title>
        <link rel="icon" href="/pokeball.png" />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100 p-6 text-center relative">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
          .font-pokemon {
            font-family: "Press Start 2P", cursive;
          }
        `}</style>

        <div className="absolute inset-0 opacity-5 bg-[url('/pokeball-bg.svg')] bg-no-repeat bg-center bg-cover pointer-events-none" />

        <div className="flex items-center justify-center gap-3 mb-6 z-10 relative">
          <Image src="/pokeball.png" alt="Pokeball" width={40} height={40} />
          <h1 className="text-2xl md:text-4xl font-pokemon text-red-600 tracking-wider">
            Pokémon Battle Arena
          </h1>
        </div>

        {!pokemon1 || !pokemon2 ? (
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10 z-10 relative">
            <select
              value={selected1}
              onChange={(e) => setSelected1(e.target.value)}
              className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-full border-2 border-blue-500 shadow text-sm font-semibold"
            >
              <option value="">Choose Pokémon 1</option>
              {pokemonList.map((name) => (
                <option key={name}>{name.toUpperCase()}</option>
              ))}
            </select>
            <span className="text-lg font-bold">VS</span>
            <select
              value={selected2}
              onChange={(e) => setSelected2(e.target.value)}
              className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-full border-2 border-blue-500 shadow text-sm font-semibold"
            >
              <option value="">Choose Pokémon 2</option>
              {pokemonList.map((name) => (
                <option key={name}>{name.toUpperCase()}</option>
              ))}
            </select>
            <button
              onClick={startBattle}
              className="bg-red-500 text-white font-bold px-5 py-2 rounded-full shadow hover:bg-red-600 transition text-sm"
            >
              Start Battle
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[
                { p: pokemon1, hp: hp1 },
                { p: pokemon2, hp: hp2 },
              ].map(({ p, hp }, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-4 shadow-md border-2 border-yellow-300 ${
                    (turn === "p1" && i === 0) || (turn === "p2" && i === 1)
                      ? "ring-2 ring-red-500"
                      : ""
                  }`}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                  <h2 className="text-xl font-bold capitalize mt-2 text-blue-900">
                    {p.name}
                  </h2>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-4 rounded-full">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all"
                        style={{
                          width: `${(hp / (p.stats.hp * 2)) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm mt-1 text-gray-600">{hp} HP</p>
                  </div>
                </div>
              ))}
            </div>

            {!winner ? (
              <button
                onClick={attack}
                className="bg-blue-500 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-blue-600 transition mb-6"
              >
                ⚡ {turn === "p1" ? pokemon1?.name : pokemon2?.name} Attack!
              </button>
            ) : (
              <div className="mb-6 text-2xl font-bold text-green-700 animate-bounce">
                🏆 {winner} WINS!
              </div>
            )}

            <div className="max-w-xl mx-auto bg-white p-4 rounded-lg shadow-md text-left space-y-2 mb-6">
              <h3 className="text-lg font-bold mb-2">📝 Battle Log:</h3>
              {log.length === 0 ? (
                <p className="text-gray-500 italic">No moves yet</p>
              ) : (
                log.map((line, idx) => (
                  <p key={idx} className="text-sm text-gray-700">
                    {line}
                  </p>
                ))
              )}
            </div>

            <button
              onClick={reset}
              className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-yellow-600 transition"
            >
              🔄 Restart Battle
            </button>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
