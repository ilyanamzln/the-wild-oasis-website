export interface CabinPick {
  id: number;
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  image: string;
}

export interface CabinPrice {
  regular_price: number;
  discount: number;
}

export interface BookingsPick {
  id: number;
  created_at: string;
  start_date: string;
  end_date: string;
  num_nights: number;
  num_guests: number;
  total_price: number;
  guest_id: number;
  cabin_id: number;
  cabins: {
    name: string;
    image: string;
  };
}
