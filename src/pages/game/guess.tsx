import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Navbar from "@/components/Navbar";

interface Pokemon {
  name: string;
  image: string;
}

export default function GuessPage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState<"guessing" | "correct" | "wrong">(
    "guessing"
  );
  const [shakeKey, setShakeKey] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    setPokemon({ name: data.name, image: data.sprites.front_default });
    setGuess("");
    setStatus("guessing");
    setShakeKey((prev) => prev + 1);
    setTimeLeft(15);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (status === "guessing") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timerRef.current!);
            setStatus("wrong");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [shakeKey]);

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pokemon) return;

    if (guess.trim().toLowerCase() === pokemon.name.toLowerCase()) {
      setStatus("correct");
      setScore((prev) => prev + 1);
      clearInterval(timerRef.current!);
    } else {
      setStatus("wrong");
      setShakeKey((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    fetchRandomPokemon();
  };

  return (
    <>
      <Head>
        <title>Guess Pokemon</title>
        <link rel="icon" href="/pokeball.png" />
      </Head>

      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-yellow-100 flex flex-col items-center justify-center p-6 text-center relative font-[PressStart2P]">
        {/* Background Pokeball */}
        <div className="absolute inset-0 bg-[url('/pokeball-bg.svg')] bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none z-0" />

        {/* Pokémon Logo */}
        <div className="mb-4 z-10">
          <Image
            src="/pokemon.png"
            alt="Pokemon Logo"
            width={200}
            height={80}
          />
        </div>

        <h1 className="pokemon-tittle text-3xl md:text-4xl font-bold text-red-600 mb-4 drop-shadow z-10">
          Who's That Pokémon?
        </h1>

        <p className="text-sm text-gray-700 mb-2 z-10">
          Score: <span className="text-blue-700 font-bold">{score}</span>
        </p>

        {status === "guessing" && (
          <p className="text-sm mb-3 text-yellow-700 font-semibold z-10">
            Time Left: <span className="font-bold">{timeLeft}s</span>
          </p>
        )}

        {pokemon && (
          <div className="relative w-48 h-48 mb-6 z-10">
            <Image
              src={pokemon.image}
              alt="Who's that Pokémon?"
              layout="fill"
              objectFit="contain"
              className={`transition-all duration-500 rounded-xl ${
                status === "correct" ? "" : "brightness-0 grayscale"
              }`}
            />
          </div>
        )}

        <form
          key={shakeKey}
          onSubmit={handleSubmit}
          className={`w-full max-w-sm transition ${
            status === "wrong" ? "animate-[shake_0.3s_ease-in-out]" : ""
          } z-10`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter Pokémon name"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className={`w-full px-4 py-3 rounded-full border-2 text-center text-sm md:text-base shadow-md transition mb-3 tracking-wide ${
              status === "wrong"
                ? "border-red-400 text-red-600 bg-red-50"
                : status === "correct"
                ? "border-green-400 bg-green-50 text-green-700"
                : "border-blue-300"
            }`}
            disabled={status === "correct"}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-full shadow-md transition disabled:opacity-50 text-sm"
            disabled={status === "correct" || !guess}
          >
            ✅ Submit
          </button>
        </form>

        {/* Feedback */}
        {status === "correct" && (
          <div className="text-green-600 font-bold text-lg mt-4 animate-bounce z-10">
            🎉 Correct! It's {pokemon?.name.toUpperCase()}!
          </div>
        )}
        {status === "wrong" && (
          <div className="text-red-600 font-semibold mt-4 z-10">
            ❌ Try again or Next!
          </div>
        )}

        <button
          onClick={handleNext}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105 z-10"
        >
          🔁 Next
        </button>

        {/* Keyframes */}
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-6px);
            }
            75% {
              transform: translateX(6px);
            }
          }
        `}</style>
      </div>
    </>
  );
}
