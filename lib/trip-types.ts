export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url?: string;
  rating: number;
  description: string;
  geo_coordinates: Coordinates;
};

export type Activity = {
  place_name: string;
  place_details: string;
  best_time_to_visit: string;
  visit_duration: string;
  travel_time_from_previous_location: string;
  travel_mode: string;
  geo_coordinates: Coordinates;
  place_address: string;
  ticket_pricing: string;
};

export type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  description: string;
  activities: Activity[];
};

export type EstimatedBudget = {
  accommodation: string;
  food: string;
  transportation: string;
  activities: string;
  total: string;
};

export type TripPlan = {
  destination: string;
  origin: string;
  duration: string;
  budget: string;
  group_size: string;
  travel_interests: string[];
  summary: string;
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  estimated_budget: EstimatedBudget;
  travel_tips: string[];
};

export type TripSummary = {
  origin: string;
  destination: string;
  budget: string;
  group_size: string;
  duration: string;
  travel_interests: string;
  special_requirements: string;
};
