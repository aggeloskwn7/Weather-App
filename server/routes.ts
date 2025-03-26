import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios, { AxiosError } from "axios";

// Helper function to handle API errors
function handleApiError(error: any, defaultMessage: string) {
  console.error(`Error: ${defaultMessage}`, error);
  
  // Check if it's an API error response
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // API key errors (commonly 401)
    if (axiosError.response?.status === 401) {
      return {
        status: 401,
        message: "OpenWeatherMap API key is invalid or unauthorized. Please check your API key configuration.",
        details: axiosError.response?.data?.message || "Authentication failed",
      };
    }
    
    // Rate limiting (commonly 429)
    if (axiosError.response?.status === 429) {
      return {
        status: 429, 
        message: "Too many requests to the weather service. Please try again later.",
        details: axiosError.response?.data?.message || "Rate limit exceeded",
      };
    }
    
    // Other API errors with response
    if (axiosError.response?.data) {
      return {
        status: axiosError.response.status || 500,
        message: defaultMessage,
        details: axiosError.response.data.message || JSON.stringify(axiosError.response.data),
      };
    }
    
    // Network errors
    if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
      return {
        status: 503,
        message: "Could not connect to the weather service. Please check your internet connection.",
        details: axiosError.message,
      };
    }
  }
  
  // Default error response
  return {
    status: 500,
    message: defaultMessage,
    details: error.message || "Unknown error occurred",
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // OpenWeatherMap API key from environment
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  
  // Base URL for OpenWeatherMap API
  const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
  const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";
  
  // Check if API key is configured
  if (!OPENWEATHER_API_KEY) {
    console.warn("Warning: OPENWEATHER_API_KEY environment variable is not set");
  }
  
  // Geocoding API to search for locations
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
  
  // Reverse geocoding to get location name from coordinates
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
  
  // Get weather data for a specific location
  app.get("/api/weather/data", async (req, res) => {
    try {
      const { lat, lon, units = "imperial" } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      // Get weather data from OpenWeatherMap One Call API
      const response = await axios.get(
        `${OPENWEATHER_BASE_URL}/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=minutely&appid=${OPENWEATHER_API_KEY}`
      );
      
      res.json(response.data);
    } catch (error) {
      const errorResponse = handleApiError(error, "Failed to fetch weather data");
      res.status(errorResponse.status).json(errorResponse);
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
