export type SportType = 'Football' | 'Box Cricket' | 'Padel';

export interface SportMatch {
  id: string;
  turfName: string;
  location: string;
  city: string;
  sport: SportType;
  format: string; // e.g., "5v5", "6v6", "Doubles"
  time: string; // e.g., "07:00 PM - 08:00 PM"
  date: string; // YYYY-MM-DD
  pricePerPlayer: number; // in INR
  slotsTotal: number;
  slotsFilled: number;
  joinedPlayers: string[]; // array of player names
  hostName: string;
  intensity: 'Friendly' | 'Competitive' | 'Mixed';
  distance?: string; // distance from selected city center
}

export type MetroCity = 'Bengaluru' | 'Delhi NCR' | 'Mumbai' | 'Hyderabad' | 'Chennai';

export interface UserProfile {
  name: string;
  phone: string;
  joinedGames: string[]; // match IDs
  walletBalance: number; // in INR
}
