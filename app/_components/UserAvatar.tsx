import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user)
    return (
      <Link href="/account" className="transition-colors hover:text-accent-400">
        Guest area
      </Link>
    );

  return (
    <Link
      href="/account"
      className="flex items-center gap-4 transition-colors hover:text-accent-400"
    >
      <img
        className="h-8 rounded-full"
        src={session?.user?.image ?? undefined}
        alt={session?.user?.name ?? "User Avatar"}
        referrerPolicy="no-referrer"
      />
      <span>{session?.user?.name}</span>
    </Link>
  );
}
