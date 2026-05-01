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

export const getWeatherIcon = (
  conditionCode: number, 
  isDay: boolean = true, 
  className: string = "w-8 h-8"
) => {
  if (conditionCode >= 200 && conditionCode < 300) {
    return <CloudLightning className={className} />;
  }
  
  if (conditionCode >= 300 && conditionCode < 400) {
    return <CloudDrizzle className={className} />;
  }
  
  if (conditionCode >= 500 && conditionCode < 600) {
    if (conditionCode === 511) {
      return <CloudHail className={className} />;
    }
    return <CloudRain className={className} />;
  }
  
  if (conditionCode >= 600 && conditionCode < 700) {
    if (conditionCode === 601 || conditionCode === 602) {
      return <Snowflake className={className} />;
    }
    return <CloudSnow className={className} />;
  }
  
  if (conditionCode >= 700 && conditionCode < 800) {
    if (conditionCode === 781) {
      return <Wind className={className} />;
    }
    return <CloudFog className={className} />;
  }
  
  if (conditionCode === 800) {
    return isDay ? <Sun className={className} /> : <Moon className={className} />;
  }
  
  if (conditionCode > 800 && conditionCode < 900) {
    if (conditionCode === 801) {
      return isDay ? <CloudSun className={className} /> : <Cloud className={className} />;
    }
    return <Cloud className={className} />;
  }
  
  return isDay ? <Sun className={className} /> : <Moon className={className} />;
};

export const getWeatherGradient = (conditionCode: number, isDay: boolean = true): string => {
  if (conditionCode === 800) {
    return isDay 
      ? "bg-gradient-to-b from-blue-500 to-sky-300"
      : "bg-gradient-to-b from-slate-800 to-slate-950";
  }
  
  if (conditionCode === 801) {
    return isDay 
      ? "bg-gradient-to-b from-blue-400 to-blue-300" 
      : "bg-gradient-to-b from-slate-700 to-slate-900";
  }
  
  if (conditionCode > 801 && conditionCode <= 804) {
    return "bg-gradient-to-b from-gray-400 to-gray-300";
  }
  
  if ((conditionCode >= 300 && conditionCode < 400) || 
      (conditionCode >= 500 && conditionCode < 600)) {
    return "bg-gradient-to-b from-slate-600 to-slate-700";
  }
  
  if (conditionCode >= 600 && conditionCode < 700) {
    return "bg-gradient-to-b from-slate-300 to-slate-200";
  }
  
  if (conditionCode >= 200 && conditionCode < 300) {
    return "bg-gradient-to-b from-slate-700 to-slate-900";
  }
  
  return isDay 
    ? "bg-gradient-to-b from-blue-500 to-sky-300" 
    : "bg-gradient-to-b from-slate-800 to-slate-950";
};

export const getWeatherIconColor = (conditionCode: number): string => {
  if (conditionCode === 800) {
    return "text-yellow-300";
  }
  
  if (conditionCode > 800 && conditionCode < 900) {
    return "text-slate-500 dark:text-slate-300";
  }
  
  if ((conditionCode >= 300 && conditionCode < 400) || 
      (conditionCode >= 500 && conditionCode < 600)) {
    return "text-sky-500 dark:text-sky-400";
  }
  
  if (conditionCode >= 600 && conditionCode < 700) {
    return "text-slate-600 dark:text-slate-200";
  }
  
  if (conditionCode >= 200 && conditionCode < 300) {
    return "text-violet-500 dark:text-violet-400";
  }
  
  return "text-muted-foreground";
};
