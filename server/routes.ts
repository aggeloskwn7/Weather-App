import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios, { AxiosError } from "axios";

function handleApiError(error: any, defaultMessage: string) {
  console.error(`Error: ${defaultMessage}`, error);
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response?.status === 401) {
      return {
        status: 401,
        message: "OpenWeatherMap API key is invalid or unauthorized. Please check your API key configuration.",
        details: axiosError.response?.data?.message || "Authentication failed",
      };
    }
    
    if (axiosError.response?.status === 429) {
      return {
        status: 429, 
        message: "Too many requests to the weather service. Please try again later.",
        details: axiosError.response?.data?.message || "Rate limit exceeded",
      };
    }
    
    if (axiosError.response?.data) {
      return {
        status: axiosError.response.status || 500,
        message: defaultMessage,
        details: axiosError.response.data.message || JSON.stringify(axiosError.response.data),
      };
    }
    
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
      return {
        status: 503,
        message: "Could not connect to the weather service. Please check your internet connection.",
        details: axiosError.message,
      };
    }
  }
  
  return {
    status: 500,
    message: defaultMessage,
    details: error.message || "Unknown error occurred",
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY?.trim();
  
  const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
  const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";
  
  if (!OPENWEATHER_API_KEY) {
    console.warn("Warning: OPENWEATHER_API_KEY environment variable is not set");
  }
  
  app.get("/api/weather/locations", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      
      const response = await axios.get(
        `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );
      
      res.json(response.data);
    } catch (error) {
      const errorResponse = handleApiError(error, "Failed to fetch locations");
      res.status(errorResponse.status).json(errorResponse);
    }
  });
  
  app.get("/api/weather/reverse-geocode", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const response = await axios.get(
        `${OPENWEATHER_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      res.json(response.data);
    } catch (error) {
      const errorResponse = handleApiError(error, "Failed to reverse geocode location");
      res.status(errorResponse.status).json(errorResponse);
    }
  });
  
  app.get("/api/weather/data", async (req, res) => {
    try {
      const { lat, lon, units = "imperial" } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const currentWeatherResponse = await axios.get(
        `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
      );
      
      const forecastResponse = await axios.get(
        `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${OPENWEATHER_API_KEY}`
      );
      
      const currentData = currentWeatherResponse.data;
      const forecastData = forecastResponse.data;
      
      interface ForecastItem {
        dt: number;
        main: {
          temp: number;
          feels_like: number;
          pressure: number;
          humidity: number;
        };
        weather: Array<{
          id: number;
          main: string;
          description: string;
          icon: string;
        }>;
        clouds: { all: number };
        wind: {
          speed: number;
          deg: number;
          gust?: number;
        };
        visibility: number;
        pop?: number;
      }
      
      const hourlyData = forecastData.list.slice(0, 24).map((item: ForecastItem) => ({
        dt: item.dt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        uvi: 0,
        clouds: item.clouds.all,
        visibility: item.visibility,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        wind_gust: item.wind.gust,
        weather: item.weather,
        pop: item.pop || 0
      }));
      
      const groupedByDay: Record<string, ForecastItem[]> = {};
      forecastData.list.forEach((item: ForecastItem) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!groupedByDay[date]) {
          groupedByDay[date] = [];
        }
        groupedByDay[date].push(item);
      });
      
      const dailyData = Object.keys(groupedByDay).map(date => {
        const dayItems = groupedByDay[date];
        const temps = dayItems.map(item => item.main.temp);
        const mainWeather = dayItems.length > 0 ? dayItems[Math.floor(dayItems.length / 2)].weather[0] : { id: 800, main: "Clear", description: "clear sky", icon: "01d" };
        
        return {
          dt: dayItems[0].dt,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset,
          temp: {
            day: temps.reduce((sum: number, temp: number) => sum + temp, 0) / temps.length,
            min: Math.min(...temps),
            max: Math.max(...temps),
            night: dayItems.length > 0 ? dayItems[dayItems.length - 1].main.temp : temps[0],
            eve: dayItems.length > 0 ? dayItems[Math.floor(dayItems.length * 0.75)].main.temp : temps[0],
            morn: dayItems.length > 0 ? dayItems[0].main.temp : temps[0]
          },
          feels_like: {
            day: dayItems[Math.floor(dayItems.length / 2)].main.feels_like,
            night: dayItems[dayItems.length - 1].main.feels_like,
            eve: dayItems[Math.floor(dayItems.length * 0.75)].main.feels_like,
            morn: dayItems[0].main.feels_like
          },
          pressure: dayItems[0].main.pressure,
          humidity: dayItems[0].main.humidity,
          weather: [mainWeather],
          clouds: dayItems[0].clouds.all,
          wind_speed: dayItems[0].wind.speed,
          wind_deg: dayItems[0].wind.deg,
          pop: Math.max(...dayItems.map(item => item.pop || 0))
        };
      });
      
      const formattedResponse = {
        lat: parseFloat(lat as string),
        lon: parseFloat(lon as string),
        timezone: forecastData.city.timezone,
        timezone_offset: 0,
        current: {
          dt: currentData.dt,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset,
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          pressure: currentData.main.pressure,
          humidity: currentData.main.humidity,
          dew_point: 0,
          uvi: 0,
          clouds: currentData.clouds.all,
          visibility: currentData.visibility,
          wind_speed: currentData.wind.speed,
          wind_deg: currentData.wind.deg,
          wind_gust: currentData.wind.gust,
          weather: currentData.weather,
        },
        hourly: hourlyData,
        daily: dailyData
      };
      
      res.json(formattedResponse);
    } catch (error) {
      const errorResponse = handleApiError(error, "Failed to fetch weather data");
      res.status(errorResponse.status).json(errorResponse);
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
