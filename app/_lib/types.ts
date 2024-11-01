export interface CabinPick {
  id: number;
  name: string | null;
  max_capacity: number | null;
  regular_price: number | null;
  discount: number | null;
  image: string | null;
}

export interface CabinPrice {
  regular_price: number | null;
  discount: number | null;
}

export interface BookingsPick {
  id: number;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  num_nights: number | null;
  num_guests: number | null;
  total_price: number | null;
  guest_id: number | null;
  cabin_id: number | null;
  cabins: {
    name: string | null;
    image: string | null;
  } | null;
}
