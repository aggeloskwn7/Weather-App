import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type Units = 'metric' | 'imperial';
type PressureUnits = 'hPa' | 'inHg';
type Theme = 'light' | 'dark' | 'auto';

interface WeatherSettings {
  temperatureUnit: Units;
  windSpeedUnit: Units;
  pressureUnit: PressureUnits;
  distanceUnit: Units;
  theme: Theme;
  weatherAnimation: boolean;
  severeWeatherAlerts: boolean;
  dailyForecastAlerts: boolean;
  precipitationAlerts: boolean;
  hourlyForecastMode: '12h' | '24h';
}

interface WeatherContextType {
  settings: WeatherSettings;
  updateSettings: (newSettings: Partial<WeatherSettings>) => void;
  location: { lat: number; lon: number; name: string } | null;
  setLocation: (location: { lat: number; lon: number; name: string }) => void;
  isSettingsPanelOpen: boolean;
  toggleSettingsPanel: () => void;
  mapView: 'radar' | 'satellite' | 'temperature';
  setMapView: (view: 'radar' | 'satellite' | 'temperature') => void;
}

const defaultSettings: WeatherSettings = {
  temperatureUnit: 'imperial',
  windSpeedUnit: 'imperial',
  pressureUnit: 'hPa',
  distanceUnit: 'imperial',
  theme: 'light',
  weatherAnimation: true,
  severeWeatherAlerts: true,
  dailyForecastAlerts: false,
  precipitationAlerts: true,
  hourlyForecastMode: '12h'
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WeatherSettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('weatherSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [mapView, setMapView] = useState<'radar' | 'satellite' | 'temperature'>('radar');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else if (settings.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark ? root.classList.add('dark') : root.classList.remove('dark');
    }
  }, [settings]);

  // Load last location from localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, []);

  // Update location and save to localStorage
  const handleSetLocation = (newLocation: { lat: number; lon: number; name: string }) => {
    setLocation(newLocation);
    localStorage.setItem('weatherLocation', JSON.stringify(newLocation));
    
    // Invalidate cached weather data
    queryClient.invalidateQueries();
  };

  const updateSettings = (newSettings: Partial<WeatherSettings>) => {
    setSettings(prev => {
      const updatedSettings = { ...prev, ...newSettings };
      
      // If we changed units, invalidate queries to refetch with new units
      if (
        prev.temperatureUnit !== newSettings.temperatureUnit ||
        prev.windSpeedUnit !== newSettings.windSpeedUnit
      ) {
        queryClient.invalidateQueries();
        toast({
          title: "Units updated",
          description: "Weather data will refresh with your new units"
        });
      }
      
      return updatedSettings;
    });
  };

  const toggleSettingsPanel = () => {
    setIsSettingsPanelOpen(prev => !prev);
  };

  return (
    <WeatherContext.Provider
      value={{
        settings,
        updateSettings,
        location,
        setLocation: handleSetLocation,
        isSettingsPanelOpen,
        toggleSettingsPanel,
        mapView,
        setMapView
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
