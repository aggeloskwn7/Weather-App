import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Weather locations (saved by users)
export const weatherLocations = pgTable("weather_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  lat: text("latitude").notNull(),
  lon: text("longitude").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertWeatherLocationSchema = createInsertSchema(weatherLocations).pick({
  userId: true,
  name: true,
  lat: true,
  lon: true,
  isFavorite: true,
  createdAt: true,
});

// Weather settings per user
export const weatherSettings = pgTable("weather_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  temperatureUnit: text("temperature_unit").notNull().default("imperial"),
  windSpeedUnit: text("wind_speed_unit").notNull().default("imperial"),
  pressureUnit: text("pressure_unit").notNull().default("hPa"),
  distanceUnit: text("distance_unit").notNull().default("imperial"),
  theme: text("theme").notNull().default("light"),
  weatherAnimation: boolean("weather_animation").default(true),
  notifications: jsonb("notifications").default({
    severeWeatherAlerts: true,
    dailyForecastAlerts: false,
    precipitationAlerts: true
  }),
});

export const insertWeatherSettingsSchema = createInsertSchema(weatherSettings).pick({
  userId: true,
  temperatureUnit: true,
  windSpeedUnit: true,
  pressureUnit: true,
  distanceUnit: true,
  theme: true,
  weatherAnimation: true,
  notifications: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWeatherLocation = z.infer<typeof insertWeatherLocationSchema>;
export type WeatherLocation = typeof weatherLocations.$inferSelect;

export type InsertWeatherSettings = z.infer<typeof insertWeatherSettingsSchema>;
export type WeatherSettings = typeof weatherSettings.$inferSelect;
