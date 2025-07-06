import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface Props {
  setTypeFilter: (type: string) => void;
}

export default function FilterType({ setTypeFilter }: Props) {
  const [types, setTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

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
    const fetchTypes = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      setTypes(["", ...data.results.map((t: any) => t.name)]); // add "All Types"
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    setTypeFilter(selected);
  }, [selected]);

  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-full bg-white py-2 pl-4 pr-10 text-left shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <span
              className={`block truncate capitalize ${
                typeColorMap[selected] || ""
              }`}
            >
              {selected ? selected : "🌈 All Types"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {types.map((type) => (
                <Listbox.Option
                  key={type}
                  value={type}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 capitalize ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate rounded-full px-2 py-1 text-sm font-medium ${
                          typeColorMap[type] || "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {type === "" ? "🌈 All Types" : type}
                      </span>
                      {selected && (
                        <span className="absolute left-2 top-2 text-blue-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
