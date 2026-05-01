import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export default function SettingsPanel() {
  const { settings, updateSettings, isSettingsPanelOpen, toggleSettingsPanel } = useWeather();
  
  if (!isSettingsPanelOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 z-40">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-lg transform transition-transform duration-300">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            <button 
              className="p-2 rounded-full hover:bg-secondary transition duration-200"
              onClick={toggleSettingsPanel}
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)" }}>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Units</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Temperature</span>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.temperatureUnit === 'imperial' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ temperatureUnit: 'imperial' })}
                  >
                    °F
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.temperatureUnit === 'metric' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ temperatureUnit: 'metric' })}
                  >
                    °C
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Wind Speed</span>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.windSpeedUnit === 'imperial' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ windSpeedUnit: 'imperial' })}
                  >
                    mph
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.windSpeedUnit === 'metric' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ windSpeedUnit: 'metric' })}
                  >
                    km/h
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Pressure</span>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.pressureUnit === 'hPa' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ pressureUnit: 'hPa' })}
                  >
                    hPa
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.pressureUnit === 'inHg' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ pressureUnit: 'inHg' })}
                  >
                    inHg
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Distance</span>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.distanceUnit === 'imperial' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ distanceUnit: 'imperial' })}
                  >
                    mi
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.distanceUnit === 'metric' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ distanceUnit: 'metric' })}
                  >
                    km
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Theme</span>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'light' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    Light
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'dark' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    Dark
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'auto' 
                        ? 'bg-card text-card-foreground shadow' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => updateSettings({ theme: 'auto' })}
                  >
                    Auto
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Weather Animation</span>
                <Switch
                  checked={settings.weatherAnimation}
                  onCheckedChange={(checked) => updateSettings({ weatherAnimation: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Severe Weather Alerts</span>
                <Switch
                  checked={settings.severeWeatherAlerts}
                  onCheckedChange={(checked) => updateSettings({ severeWeatherAlerts: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Daily Forecast</span>
                <Switch
                  checked={settings.dailyForecastAlerts}
                  onCheckedChange={(checked) => updateSettings({ dailyForecastAlerts: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">Precipitation Alerts</span>
                <Switch
                  checked={settings.precipitationAlerts}
                  onCheckedChange={(checked) => updateSettings({ precipitationAlerts: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">About</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Weather App v1.0.0</p>
              <p>Data provided by OpenWeatherMap API</p>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
