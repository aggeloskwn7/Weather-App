import { 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudFog, 
  CloudLightning, 
  Sun, 
  Moon, 
  Wind,
  CloudHail,
  Snowflake 
} from "lucide-react";

// Map of weather condition codes to icons
// Based on OpenWeatherMap condition codes: https://openweathermap.org/weather-conditions
export const getWeatherIcon = (
  conditionCode: number, 
  isDay: boolean = true, 
  className: string = "w-8 h-8"
) => {
  // Group 2xx: Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return <CloudLightning className={className} />;
  }
  
  // Group 3xx: Drizzle
  if (conditionCode >= 300 && conditionCode < 400) {
    return <CloudDrizzle className={className} />;
  }
  
  // Group 5xx: Rain
  if (conditionCode >= 500 && conditionCode < 600) {
    if (conditionCode === 511) {
      return <CloudHail className={className} />; // Freezing rain
    }
    return <CloudRain className={className} />;
  }
  
  // Group 6xx: Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    if (conditionCode === 601 || conditionCode === 602) {
      return <Snowflake className={className} />; // Snow
    }
    return <CloudSnow className={className} />;
  }
  
  // Group 7xx: Atmosphere
  if (conditionCode >= 700 && conditionCode < 800) {
    if (conditionCode === 781) {
      return <Wind className={className} />; // Tornado
    }
    return <CloudFog className={className} />;
  }
  
  // Group 800: Clear
  if (conditionCode === 800) {
    return isDay ? <Sun className={className} /> : <Moon className={className} />;
  }
  
  // Group 80x: Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    if (conditionCode === 801) {
      return isDay ? <CloudSun className={className} /> : <Cloud className={className} />;
    }
    return <Cloud className={className} />;
  }
  
  // Default
  return isDay ? <Sun className={className} /> : <Moon className={className} />;
};

// Weather background gradients based on conditions
export const getWeatherGradient = (conditionCode: number, isDay: boolean = true): string => {
  // Clear sky
  if (conditionCode === 800) {
    return isDay 
      ? "bg-gradient-to-b from-blue-500 to-sky-300" // day
      : "bg-gradient-to-b from-slate-800 to-slate-950"; // night
  }
  
  // Few clouds
  if (conditionCode === 801) {
    return isDay 
      ? "bg-gradient-to-b from-blue-400 to-blue-300" 
      : "bg-gradient-to-b from-slate-700 to-slate-900";
  }
  
  // Clouds
  if (conditionCode > 801 && conditionCode <= 804) {
    return "bg-gradient-to-b from-gray-400 to-gray-300";
  }
  
  // Rain
  if ((conditionCode >= 300 && conditionCode < 400) || 
      (conditionCode >= 500 && conditionCode < 600)) {
    return "bg-gradient-to-b from-slate-600 to-slate-700";
  }
  
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return "bg-gradient-to-b from-slate-300 to-slate-200";
  }
  
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return "bg-gradient-to-b from-slate-700 to-slate-900";
  }
  
  // Default
  return isDay 
    ? "bg-gradient-to-b from-blue-500 to-sky-300" 
    : "bg-gradient-to-b from-slate-800 to-slate-950";
};

export const getWeatherIconColor = (conditionCode: number): string => {
  // Clear sky
  if (conditionCode === 800) {
    return "text-yellow-300";
  }
  
  // Clouds
  if (conditionCode > 800 && conditionCode < 900) {
    return "text-gray-400";
  }
  
  // Rain
  if ((conditionCode >= 300 && conditionCode < 400) || 
      (conditionCode >= 500 && conditionCode < 600)) {
    return "text-blue-400";
  }
  
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return "text-slate-200";
  }
  
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return "text-purple-500";
  }
  
  // Default
  return "text-gray-400";
};
