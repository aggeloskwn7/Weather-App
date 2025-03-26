import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemp(temp: number, unit: 'metric' | 'imperial' = 'imperial'): string {
  const tempRounded = Math.round(temp);
  return `${tempRounded}°${unit === 'metric' ? 'C' : 'F'}`;
}

export function formatWindSpeed(
  speed: number, 
  unit: 'metric' | 'imperial' = 'imperial'
): string {
  const speedRounded = Math.round(speed);
  return `${speedRounded} ${unit === 'metric' ? 'km/h' : 'mph'}`;
}

export function formatPressure(
  pressure: number, 
  unit: 'hPa' | 'inHg' = 'hPa'
): string {
  if (unit === 'inHg') {
    // Convert hPa to inHg
    const inHg = (pressure * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${pressure} hPa`;
}

export function formatDistance(
  distance: number, 
  unit: 'metric' | 'imperial' = 'imperial'
): string {
  if (unit === 'metric') {
    // Convert miles to kilometers if needed
    const km = Math.round(distance * 1.60934);
    return `${km} km`;
  }
  return `${Math.round(distance)} mi`;
}

export function formatDateTime(timestamp: number, formatString: string = 'h:mm a'): string {
  return format(new Date(timestamp * 1000), formatString);
}

export function formatDate(timestamp: number, formatString: string = 'EEEE, d MMM'): string {
  return format(new Date(timestamp * 1000), formatString);
}

export function formatDay(timestamp: number): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const date = new Date(timestamp * 1000);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return format(date, 'EEE');
  }
}

export function getUVIndexDescription(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function isDay(sunrise: number, sunset: number): boolean {
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  return now >= sunrise && now < sunset;
}
