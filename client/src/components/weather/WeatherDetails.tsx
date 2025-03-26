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
      <section className="bg-white py-6 px-4 shadow-sm mb-4">
        <div className="container mx-auto">
          <Skeleton className="h-6 w-48 mb-4" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
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
  const visibilityInMiles = visibility / 1609; // convert meters to miles
  
  return (
    <section className="bg-white py-6 px-4 shadow-sm mb-4">
      <div className="container mx-auto">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Weather Details</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Feels Like</div>
            <div className="flex items-center">
              <i className="fas fa-temperature-high text-amber-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">
                {formatTemp(feels_like, settings.temperatureUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Humidity</div>
            <div className="flex items-center">
              <i className="fas fa-tint text-blue-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">{humidity}%</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Wind</div>
            <div className="flex items-center">
              <i className="fas fa-wind text-gray-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">
                {formatWindSpeed(wind_speed, settings.windSpeedUnit)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <i className="fas fa-location-arrow mr-1" style={{ transform: `rotate(${wind_deg - 45}deg)` }}></i>
              <span>{windDirection}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Pressure</div>
            <div className="flex items-center">
              <i className="fas fa-compress-alt text-slate-700 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">
                {formatPressure(pressure, settings.pressureUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Visibility</div>
            <div className="flex items-center">
              <i className="fas fa-eye text-gray-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">
                {formatDistance(visibilityInMiles, settings.distanceUnit)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">UV Index</div>
            <div className="flex items-center">
              <i className="fas fa-sun text-yellow-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">{Math.round(uvi)}</span>
              <span className="text-sm text-gray-500 ml-2">{uvDescription}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Sunrise</div>
            <div className="flex items-center">
              <i className="fas fa-sunrise text-yellow-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">{formatDateTime(sunrise, 'h:mm a')}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Sunset</div>
            <div className="flex items-center">
              <i className="fas fa-sunset text-amber-500 mr-2"></i>
              <span className="text-xl font-medium text-gray-800">{formatDateTime(sunset, 'h:mm a')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
