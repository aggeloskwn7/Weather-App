import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // OpenWeatherMap API key from environment
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "c612516be5e1052c8c30fccc1c3ff0e7";
  
  // Base URL for OpenWeatherMap API
  const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
  const OPENWEATHER_GEO_URL = "https://api.openweathermap.org/geo/1.0";
  
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
      console.error("Error fetching locations:", error);
      res.status(500).json({ message: "Failed to fetch locations" });
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
      console.error("Error reverse geocoding:", error);
      res.status(500).json({ message: "Failed to reverse geocode" });
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
      console.error("Error fetching weather data:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
