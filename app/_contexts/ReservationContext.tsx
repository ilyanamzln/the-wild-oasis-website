"use client";

import { createContext, Dispatch, SetStateAction, use, useState } from "react";
import { DateRange } from "react-day-picker";

type ReservationContextValue = {
  range: DateRange | undefined;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
};

const initialState: DateRange = {
  from: undefined,
  to: undefined,
};

const ReservationContext = createContext<ReservationContextValue | undefined>(
  undefined,
);

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState);

  function resetRange() {
    setRange(initialState);
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = use(ReservationContext);
  if (!context)
    throw new Error("Reservation context was used outside of its provider");
  return context;
}

export { ReservationProvider, useReservation };
