import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  formatTemp, 
  formatWindSpeed, 
  formatPressure, 
  formatDistance, 
  formatDateTime,
  getUVIndexDescription,
  getWindDirection
} from "@/lib/utils";

interface WeatherDetailsProps {
  data: {
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    pressure: number;
    visibility: number;
    uvi: number;
    sunrise: number;
    sunset: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
  };
  isLoading: boolean;
}

export default function WeatherDetails({ data, isLoading }: WeatherDetailsProps) {
  const { settings } = useWeather();
  
  if (isLoading) {
    return (
      <section className="bg-card text-card-foreground py-6 px-4 shadow-sm mb-4 border-b border-border">
        <div className="container mx-auto">
          <Skeleton className="h-6 w-48 mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-weather-accent-muted p-4 rounded-lg">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-6 w-24" />
                {i >= 4 && i <= 7 && <Skeleton className="h-4 w-16 mt-1" />}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  const {
    feels_like,
    humidity,
    wind_speed,
    wind_deg,
    pressure,
    visibility,
    uvi,
    sunrise,
    sunset
  } = data;
  
  const windDirection = getWindDirection(wind_deg);
  const uvDescription = getUVIndexDescription(uvi);
  const visibilityInMiles = visibility / 1609;
  
  return (
    <section className="bg-card text-card-foreground py-6 px-4 shadow-sm mb-4 border-b border-border">
      <div className="container mx-auto">
        <h3 className="text-lg font-medium text-foreground mb-4">Weather Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Feels Like</div>
            <div className="flex items-center">
              <i className="fas fa-temperature-high text-amber-500 mr-2"></i>
              <span className="text-xl font-medium text-foreground">
                {formatTemp(feels_like, settings.temperatureUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Humidity</div>
            <div className="flex items-center">
              <i className="fas fa-tint text-sky-500 dark:text-sky-400 mr-2"></i>
              <span className="text-xl font-medium text-foreground">{humidity}%</span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Wind</div>
            <div className="flex items-center">
              <i className="fas fa-wind text-muted-foreground mr-2"></i>
              <span className="text-xl font-medium text-foreground">
                {formatWindSpeed(wind_speed, settings.windSpeedUnit)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <i className="fas fa-location-arrow mr-1" style={{ transform: `rotate(${wind_deg - 45}deg)` }}></i>
              <span>{windDirection}</span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Pressure</div>
            <div className="flex items-center">
              <i className="fas fa-compress-alt text-slate-600 dark:text-slate-300 mr-2"></i>
              <span className="text-xl font-medium text-foreground">
                {formatPressure(pressure, settings.pressureUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Visibility</div>
            <div className="flex items-center">
              <i className="fas fa-eye text-muted-foreground mr-2"></i>
              <span className="text-xl font-medium text-foreground">
                {formatDistance(visibilityInMiles, settings.distanceUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">UV Index</div>
            <div className="flex items-center">
              <i className="fas fa-sun text-yellow-500 dark:text-yellow-400 mr-2"></i>
              <span className="text-xl font-medium text-foreground">{Math.round(uvi)}</span>
              <span className="text-sm text-muted-foreground ml-2">{uvDescription}</span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Sunrise</div>
            <div className="flex items-center">
              <i className="fas fa-sunrise text-amber-500 dark:text-amber-400 mr-2"></i>
              <span className="text-xl font-medium text-foreground">{formatDateTime(sunrise, 'h:mm a')}</span>
            </div>
          </div>
          
          <div className="bg-weather-accent-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Sunset</div>
            <div className="flex items-center">
              <i className="fas fa-sunset text-amber-500 dark:text-amber-400 mr-2"></i>
              <span className="text-xl font-medium text-foreground">{formatDateTime(sunset, 'h:mm a')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
