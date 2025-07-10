import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-16 py-6 bg-yellow-200 border-t-4 border-red-500 text-center relative z-10">
      <div className="flex justify-center items-center gap-2 mb-2">
        <Image src="/pokeball.png" alt="Pokeball" width={24} height={24} />
        <p className="font-pokemon text-sm text-gray-800 tracking-wider">
          Mini PokèDex
        </p>
      </div>
      <p className="text-xs text-gray-600">
        Built by{" "}
        <a
          className="underline hover:text-blue-600"
          href="https://github.com/MuhammadRizki1206"
          target="_blank"
          rel="noreferrer"
        >
          Muhammad Rizki
        </a>{" "}
        — Powered by{" "}
        <a
          href="https://pokeapi.co"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-blue-600"
        >
          PokeAPI
        </a>
      </p>
    </footer>
  );
};

export default Footer;
