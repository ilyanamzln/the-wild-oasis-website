"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function updateGuest(formData: FormData) {
  const nationalIdRegex: RegExp = /^[a-zA-Z0-9]{6,12}$/;
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const national_id = formData.get("national_id") as string;
  const [nationality, country_flag] = (
    formData.get("nationality") as string
  ).split("%");

  if (!nationalIdRegex.test(national_id))
    throw new Error("Please provide a valid national ID");

  const updateData = { national_id, country_flag, nationality };

  console.log(updateData);

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId!);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
