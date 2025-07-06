import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface PokeDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function PokeDropdown({
  label,
  options,
  value,
  onChange,
}: PokeDropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative w-60 font-pokemon text-sm z-50">
      <button
        type="button"
        className="w-full bg-yellow-300 border-4 border-blue-500 text-blue-800 font-bold rounded-full py-2 px-4 flex justify-between items-center shadow hover:brightness-105 transition"
        onClick={(e) => {
          e.stopPropagation(); // prevent window click
          setOpen((prev) => !prev);
        }}
      >
        {value ? value.toUpperCase() : label}
        <ChevronDown className="ml-2 w-4 h-4" />
      </button>

      {open && (
        <div className="absolute mt-2 w-full max-h-60 overflow-y-auto bg-white border-4 border-blue-300 rounded-xl shadow-lg z-50">
          {options.map((opt) => (
            <button
              key={opt}
              className={`block w-full text-left px-4 py-2 hover:bg-yellow-100 capitalize ${
                opt === value ? "bg-yellow-200 font-bold" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(opt);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
