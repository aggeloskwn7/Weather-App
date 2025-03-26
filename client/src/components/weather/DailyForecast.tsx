import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTemp, formatDay } from "@/lib/utils";
import { getWeatherIcon, getWeatherIconColor } from "@/lib/weatherIcons";

interface DailyForecastProps {
  data: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
    pop: number; // Probability of precipitation
  }>;
  isLoading: boolean;
}

export default function DailyForecast({ data, isLoading }: DailyForecastProps) {
  const { settings } = useWeather();
  
  if (isLoading) {
    return (
      <section className="bg-white py-6 px-4 shadow-sm mb-4">
        <div className="container mx-auto">
          <Skeleton className="h-6 w-48 mb-4" />
          
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-5 w-6" />
                  <Skeleton className="h-2 w-24" />
                  <Skeleton className="h-5 w-12" />
                </div>
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
        <h3 className="text-lg font-medium text-gray-800 mb-4">10-Day Forecast</h3>
        
        <div className="space-y-4">
          {data.map((day, index) => {
            const dayCondition = day.weather[0];
            const precipProbability = Math.round(day.pop * 100);
            const iconColor = getWeatherIconColor(dayCondition.id);
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-md px-2 cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{formatDay(day.dt)}</div>
                </div>
                
                <div className="flex-1 flex justify-center">
                  <div className={iconColor}>
                    {getWeatherIcon(dayCondition.id, true, "h-6 w-6")}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-end">
                  <div className="w-full max-w-[100px]">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 w-6">{precipProbability}%</span>
                      <div className="flex-1 mx-2">
                        <div className="h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-1.5 bg-blue-400 rounded-full" 
                            style={{ width: `${precipProbability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-400 ml-2 w-8 text-right">
                    {formatTemp(day.temp.min, settings.temperatureUnit)}
                  </div>
                  <div className="w-16 mx-2">
                    <div className="h-1 bg-gray-300 rounded-full relative">
                      <div 
                        className="h-1 bg-gray-800 rounded-full absolute inset-0" 
                        style={{ 
                          width: `${(day.temp.max - day.temp.min) / (data[0].temp.max - data[0].temp.min + 10) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-800 w-8">
                    {formatTemp(day.temp.max, settings.temperatureUnit)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
