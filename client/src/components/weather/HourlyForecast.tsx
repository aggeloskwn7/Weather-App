import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatTemp, formatDateTime } from "@/lib/utils";
import { getWeatherIcon, getWeatherIconColor } from "@/lib/weatherIcons";

interface HourlyForecastProps {
  data: Array<{
    dt: number;
    temp: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
    pop: number; // Probability of precipitation
    sunrise?: number;
    sunset?: number;
  }>;
  sunrise: number;
  sunset: number;
  isLoading: boolean;
}

export default function HourlyForecast({ data, sunrise, sunset, isLoading }: HourlyForecastProps) {
  const { settings, updateSettings } = useWeather();
  const { hourlyForecastMode } = settings;
  
  const toggleHourlyView = () => {
    updateSettings({ hourlyForecastMode: hourlyForecastMode === '12h' ? '24h' : '12h' });
  };
  
  const isDay = (timestamp: number): boolean => {
    return timestamp > sunrise && timestamp < sunset;
  };
  
  const displayHours = hourlyForecastMode === '12h' ? 12 : 24;
  const hoursToShow = data?.slice(0, displayHours) || [];
  
  if (isLoading) {
    return (
      <section className="bg-white py-6 px-4 shadow-sm mb-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>
          
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 text-center px-3 py-2 w-20">
                <Skeleton className="h-5 w-12 mx-auto" />
                <Skeleton className="h-8 w-8 mx-auto my-2 rounded-full" />
                <Skeleton className="h-6 w-10 mx-auto" />
                <Skeleton className="h-4 w-6 mx-auto mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="bg-white py-6 px-4 shadow-sm mb-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Hourly Forecast</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleHourlyView}
            className="text-blue-500 text-sm font-medium"
          >
            Show {hourlyForecastMode === '12h' ? '24h' : '12h'}
          </Button>
        </div>
        
        <div className="hourly-forecast flex overflow-x-auto pb-4 space-x-4">
          {hoursToShow.map((hour, index) => {
            const hourCondition = hour.weather[0];
            const isDaytime = isDay(hour.dt);
            const iconColor = getWeatherIconColor(hourCondition.id);
            
            return (
              <div key={index} className="flex-shrink-0 text-center px-3 py-2 w-20">
                <div className="text-sm font-medium text-gray-500">
                  {index === 0 ? 'Now' : formatDateTime(hour.dt, 'h a')}
                </div>
                <div className={`my-2 ${iconColor}`}>
                  {getWeatherIcon(hourCondition.id, isDaytime, "h-8 w-8 mx-auto")}
                </div>
                <div className="text-lg font-medium text-gray-800">
                  {formatTemp(hour.temp, settings.temperatureUnit)}
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(hour.pop * 100)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
