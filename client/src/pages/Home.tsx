import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWeather } from "@/contexts/WeatherContext";
import CurrentWeather from "@/components/weather/CurrentWeather";
import HourlyForecast from "@/components/weather/HourlyForecast";
import DailyForecast from "@/components/weather/DailyForecast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import SearchBar from "@/components/weather/SearchBar";
import SettingsPanel from "@/components/weather/SettingsPanel";
import LoadingOverlay from "@/components/weather/LoadingOverlay";
import ErrorDisplay from "@/components/weather/ErrorDisplay";
import PrecipitationMap from "@/components/weather/PrecipitationMap";
import TemperatureToggle from "@/components/weather/TemperatureToggle";

// Define types for the weather data
interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
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
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
};

export default function Home() {
  const { settings, location, toggleSettingsPanel } = useWeather();
  
  // If location exists, fetch weather data
  const { 
    data: weatherData,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
    error: weatherError,
    refetch: refetchWeather
  } = useQuery<WeatherData>({
    queryKey: [
      location ? 
        `/api/weather/data?lat=${location.lat}&lon=${location.lon}&units=${settings.temperatureUnit}` : 
        null
    ],
    enabled: !!location,
  });
  
  // Attempt to get user's location when component mounts if no location is set
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const response = await fetch(
              `/api/weather/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            
            if (response.ok) {
              const locationData = await response.json();
              if (locationData.length > 0) {
                const loc = locationData[0];
                const locationName = loc.state 
                  ? `${loc.name}, ${loc.state}, ${loc.country}`
                  : `${loc.name}, ${loc.country}`;
                
                // Update the location context
                useWeather().setLocation({
                  lat: latitude,
                  lon: longitude,
                  name: locationName
                });
              }
            }
          } catch (error) {
            console.error("Error getting location name:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [location]);
  
  // Show full-page loading state if weather is loading
  if (isWeatherLoading && !weatherData) {
    return <LoadingOverlay />;
  }
  
  // Show error state if there's an error
  if (isWeatherError) {
    const errorMessage = (weatherError as Error)?.message || "Failed to fetch weather data";
    console.error("Weather error:", weatherError);
    return (
      <ErrorDisplay 
        message={errorMessage} 
        onRetry={refetchWeather} 
      />
    );
  }
  
  return (
    <div className="min-h-screen font-sans flex flex-col bg-gray-100 text-gray-800">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              <i className="fas fa-cloud-sun mr-2"></i>Weather App
            </h1>
            
            {/* Temperature Toggle */}
            <div className="hidden md:block">
              <TemperatureToggle />
            </div>
            
            {/* Location Search */}
            <SearchBar />
            
            <div className="flex items-center space-x-4">
              {/* Temperature Toggle (Mobile) */}
              <div className="md:hidden">
                <TemperatureToggle />
              </div>
              
              {/* Settings Button */}
              <button 
                className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
                onClick={toggleSettingsPanel}
              >
                <i className="fas fa-cog text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto" id="mainContent">
        {weatherData && (
          <>
            <CurrentWeather 
              data={{
                name: location?.name || "",
                dt: weatherData.current.dt,
                temp: weatherData.current.temp,
                feels_like: weatherData.current.feels_like,
                humidity: weatherData.current.humidity,
                wind_speed: weatherData.current.wind_speed,
                uvi: weatherData.current.uvi,
                weather: weatherData.current.weather,
                sunrise: weatherData.current.sunrise,
                sunset: weatherData.current.sunset,
                temp_max: weatherData.daily[0].temp.max,
                temp_min: weatherData.daily[0].temp.min
              }} 
              isLoading={isWeatherLoading}
            />
            
            <HourlyForecast 
              data={weatherData.hourly} 
              sunrise={weatherData.current.sunrise}
              sunset={weatherData.current.sunset}
              isLoading={isWeatherLoading}
            />
            
            <DailyForecast 
              data={weatherData.daily} 
              isLoading={isWeatherLoading}
            />
            
            <WeatherDetails 
              data={weatherData.current} 
              isLoading={isWeatherLoading}
            />
            
            <PrecipitationMap 
              latitude={location?.lat || 0} 
              longitude={location?.lon || 0} 
              isLoading={isWeatherLoading}
            />
          </>
        )}
        
        {!weatherData && !isWeatherLoading && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
              <i className="fas fa-search text-5xl text-gray-400 mb-4"></i>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Location Selected</h2>
              <p className="text-gray-600 mb-6">
                Search for a location or allow access to your current location to see weather information.
              </p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        fetch(`/api/weather/reverse-geocode?lat=${latitude}&lon=${longitude}`)
                          .then(res => res.json())
                          .then(data => {
                            if (data.length > 0) {
                              const loc = data[0];
                              const name = loc.state 
                                ? `${loc.name}, ${loc.state}, ${loc.country}`
                                : `${loc.name}, ${loc.country}`;
                              useWeather().setLocation({ lat: latitude, lon: longitude, name });
                            }
                          });
                      }
                    );
                  }
                }}
              >
                <i className="fas fa-location-arrow mr-2"></i>
                Use My Location
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Settings Panel */}
      <SettingsPanel />
    </div>
  );
}
