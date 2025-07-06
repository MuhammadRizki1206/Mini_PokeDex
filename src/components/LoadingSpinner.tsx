// 📁 components/LoadingSpinner.tsx
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="w-20 h-20 animate-spin">
        <Image
          src="/pokeball.png"
          alt="Loading..."
          width={80}
          height={80}
          className="w-full h-full"
        />
      </div>
      <p className="text-gray-600 font-medium">Loading Pokémon Data...</p>
    </div>
  );
}
