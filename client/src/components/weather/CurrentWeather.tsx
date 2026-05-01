import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { formatTemp, formatDate, formatDateTime } from "@/lib/utils";
import { getWeatherIcon, getWeatherGradient, getWeatherIconColor } from "@/lib/weatherIcons";
import { Skeleton } from "@/components/ui/skeleton";

interface CurrentWeatherProps {
  data: {
    name: string;
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
    sunrise: number;
    sunset: number;
    temp_max: number;
    temp_min: number;
  };
  isLoading: boolean;
}

export default function CurrentWeather({ data, isLoading }: CurrentWeatherProps) {
  const { settings } = useWeather();
  
  if (isLoading) {
    return (
      <section className="bg-gradient-to-b from-blue-500 to-sky-300 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <Skeleton className="h-7 w-48 bg-white/20" />
              <Skeleton className="h-5 w-32 mt-1 bg-white/20" />
              
              <div className="flex items-center justify-center md:justify-start mt-6">
                <Skeleton className="h-20 w-20 mr-4 bg-white/20" />
                <div>
                  <Skeleton className="h-7 w-24 bg-white/20" />
                  <Skeleton className="h-5 w-20 mt-1 bg-white/20" />
                </div>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
                <Skeleton className="h-5 w-16 bg-white/20" />
                <Skeleton className="h-5 w-16 bg-white/20" />
                <Skeleton className="h-5 w-16 bg-white/20" />
              </div>
            </div>
            
            <div className="text-center">
              <Skeleton className="h-24 w-24 rounded-full mx-auto bg-white/20" />
              <Skeleton className="h-5 w-20 mt-2 mx-auto bg-white/20" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const {
    name,
    dt,
    temp,
    feels_like,
    humidity,
    wind_speed,
    uvi,
    weather,
    sunrise,
    sunset,
    temp_max,
    temp_min
  } = data;

  const currentCondition = weather[0];
  const isDay = dt > sunrise && dt < sunset;
  const gradient = getWeatherGradient(currentCondition.id, isDay);
  const iconColor = getWeatherIconColor(currentCondition.id);

  return (
    <section className={`${gradient} text-white p-6 shadow-lg fadeIn`}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-xl font-medium opacity-90">{name}</h2>
            <p className="text-sm opacity-75">{formatDate(dt)} • {formatDateTime(dt)}</p>
            
            <div className="flex items-center justify-center md:justify-start mt-6">
              <div className="text-7xl font-light mr-4">{formatTemp(temp, settings.temperatureUnit)}</div>
              <div>
                <div className="text-xl font-medium capitalize">{currentCondition.description}</div>
                <div className="text-sm opacity-75">
                  Feels like {formatTemp(feels_like, settings.temperatureUnit)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
              <div className="flex items-center">
                <i className="fas fa-wind mr-2"></i>
                <span>{Math.round(wind_speed)} {settings.windSpeedUnit === 'metric' ? 'km/h' : 'mph'}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-tint mr-2"></i>
                <span>{humidity}%</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-sun mr-2"></i>
                <span>{Math.round(uvi)} UV</span>
              </div>
            </div>
          </div>
          
          <div className="weather-condition-icon text-center">
            <div className={`text-8xl ${iconColor}`}>
              {getWeatherIcon(currentCondition.id, isDay, "h-24 w-24")}
            </div>
            <div className="mt-2 text-sm">
              <span>H: {formatTemp(temp_max, settings.temperatureUnit)}</span> • 
              <span> L: {formatTemp(temp_min, settings.temperatureUnit)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
