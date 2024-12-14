"use client";

import { differenceInDays } from "date-fns";
import { User } from "next-auth";
import { useReservation } from "../_contexts/ReservationContext";
import { createReservation } from "../_lib/actions";
import { Tables } from "../_lib/database.types";
import SubmitButton from "./SubmitButton";

function ReservationForm({
  cabin,
  user,
}: {
  cabin: Tables<"cabins">;
  user: User;
}) {
  const { range, resetRange } = useReservation();
  const {
    max_capacity: maxCapacity,
    regular_price: regularPrice,
    discount,
    id,
  } = cabin;

  const startDate = range?.from;
  const endDate = range?.to;

  let reservationData;

  if (startDate && endDate) {
    const numNights = differenceInDays(endDate, startDate);
    const cabinPrice = numNights * (regularPrice ?? 0 - (discount ?? 0));

    reservationData = {
      start_date: startDate,
      end_date: endDate,
      num_nights: numNights,
      cabin_price: cabinPrice,
      cabin_id: id,
    };
  }

  const createReservationWithData = createReservation.bind(
    null,
    reservationData,
  );

  return (
    <div className="scale-[1.01]">
      <div className="flex items-center justify-between bg-primary-800 px-16 py-2 text-primary-300">
        <p>Logged in as</p>

        <div className="flex items-center gap-4">
          <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user?.image || undefined}
            alt={user?.name || "User Avatar"}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createReservationWithData(formData);
          resetRange();
        }}
        className="flex flex-col gap-5 bg-primary-900 px-16 py-10 text-lg"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="num_guests"
            id="num_guests"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity! }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex items-center justify-end gap-6">
          {!(startDate && endDate) ? (
            <p className="text-base text-primary-300">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
