import axios from "axios";

// OpenWeatherMap API key from environment
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Base URL for OpenWeatherMap API
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";

export interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  alerts?: WeatherAlert[];
}

export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
}

export interface HourlyWeather {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  pop: number; // Probability of precipitation
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
}

export interface DailyWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

/**
 * Search for locations by name
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  try {
    const response = await axios.get(
      `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching locations:", error);
    throw new Error("Failed to search locations");
  }
}

/**
 * Get location name from coordinates using reverse geocoding
 */
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult[]> {
  try {
    const response = await axios.get(
      `${OPENWEATHER_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    throw new Error("Failed to reverse geocode");
  }
}

/**
 * Get weather data for a location by coordinates
 */
export async function getWeatherData(
  lat: number, 
  lon: number, 
  units: "metric" | "imperial" = "imperial"
): Promise<WeatherData> {
  try {
    const response = await axios.get(
      `${OPENWEATHER_BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely&appid=${OPENWEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}
