"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData: FormData) {
  // 1. Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 3. Building update data
  const nationalIdRegex: RegExp = /^[a-zA-Z0-9]{6,12}$/;
  const national_id = formData.get("national_id") as string;
  const [nationality, country_flag] = (
    formData.get("nationality") as string
  ).split("%");

  if (!nationalIdRegex.test(national_id))
    throw new Error("Please provide a valid national ID");

  const updateData = { national_id, country_flag, nationality };
  console.log(updateData);

  // 4. Mutation
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId!);

  // 5. Error handling
  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  // 6. Revalidate
  revalidatePath("/account/profile");
}

export async function updateReservation(formData: FormData) {
  const bookingId = +formData.get("bookingId")!;

  // 1. Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2. Authorization
  const guestBookings = await getBookings(session.user.guestId!);
  if (!guestBookings.some((booking) => +booking.id === bookingId))
    throw new Error("You are not allowed to update this reservation");

  // 3. Building update data
  const updatedFields = {
    num_guests: +formData.get("num_guests")!,
    observations: (formData.get("observations") as string)?.slice(0, 1000),
  };
  console.log(updatedFields);

  // 4. Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId)
    .select()
    .single();

  // 5. Error handling
  if (error) {
    console.error(error);
    throw new Error("Reservation could not be updated");
  }

  // 6. Revalidation
  revalidatePath("/account/reservations", "layout");

  // 7. Redirect
  redirect("/account/reservations");
}

export async function deleteReservation(bookingId: number) {
  // 1. Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2. Authorization
  const guestBookings = await getBookings(session.user.guestId!);
  if (!guestBookings.some((booking) => +booking.id === +bookingId))
    throw new Error("You are not allowed to delete this reservation");

  // 3. Mutation
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  // 4. Error handling
  if (error) {
    console.error(error);
    throw new Error("Reservation could not be deleted");
  }

  // 5. Revalidation
  revalidatePath("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
