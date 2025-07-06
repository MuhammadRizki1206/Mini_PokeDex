import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Pokémon..."
        className="pl-10 pr-10 py-2 w-full rounded-full border border-red-300 shadow focus:ring-2 focus:ring-red-400 focus:outline-none transition-all text-gray-800"
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
