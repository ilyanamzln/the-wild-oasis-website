import { unstable_noStore as noStore } from "next/cache";
import { getCabins } from "../_lib/data-service";
import CabinCard from "./CabinCard";

export default async function CabinList({ filter }: { filter: string }) {
  // noStore();
  const cabins = await getCabins();

  // Object lookup
  const displayedCabins =
    {
      all: cabins,
      small: cabins.filter((cabin) => cabin.max_capacity! <= 3),
      medium: cabins.filter(
        (cabin) => cabin.max_capacity! >= 4 && cabin.max_capacity! <= 7,
      ),
      large: cabins.filter((cabin) => cabin.max_capacity! >= 8),
    }[filter] || cabins;

  if (!cabins.length) return null;
  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
