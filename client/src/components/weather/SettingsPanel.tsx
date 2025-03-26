import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Switch } from "@/components/ui/switch";

export default function SettingsPanel() {
  const { settings, updateSettings, isSettingsPanelOpen, toggleSettingsPanel } = useWeather();
  
  if (!isSettingsPanelOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40">
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            <button 
              className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
              onClick={toggleSettingsPanel}
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)" }}>
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Units</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Temperature</span>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.temperatureUnit === 'imperial' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ temperatureUnit: 'imperial' })}
                  >
                    °F
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.temperatureUnit === 'metric' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ temperatureUnit: 'metric' })}
                  >
                    °C
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Wind Speed</span>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.windSpeedUnit === 'imperial' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ windSpeedUnit: 'imperial' })}
                  >
                    mph
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.windSpeedUnit === 'metric' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ windSpeedUnit: 'metric' })}
                  >
                    km/h
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Pressure</span>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.pressureUnit === 'hPa' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ pressureUnit: 'hPa' })}
                  >
                    hPa
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.pressureUnit === 'inHg' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ pressureUnit: 'inHg' })}
                  >
                    inHg
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Distance</span>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.distanceUnit === 'imperial' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ distanceUnit: 'imperial' })}
                  >
                    mi
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.distanceUnit === 'metric' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Theme</span>
                <div className="flex items-center bg-gray-200 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'light' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    Light
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'dark' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    Dark
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${
                      settings.theme === 'auto' 
                        ? 'bg-white text-gray-800 shadow' 
                        : 'text-gray-600'
                    }`}
                    onClick={() => updateSettings({ theme: 'auto' })}
                  >
                    Auto
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Weather Animation</span>
                <Switch
                  checked={settings.weatherAnimation}
                  onCheckedChange={(checked) => updateSettings({ weatherAnimation: checked })}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Severe Weather Alerts</span>
                <Switch
                  checked={settings.severeWeatherAlerts}
                  onCheckedChange={(checked) => updateSettings({ severeWeatherAlerts: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Daily Forecast</span>
                <Switch
                  checked={settings.dailyForecastAlerts}
                  onCheckedChange={(checked) => updateSettings({ dailyForecastAlerts: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Precipitation Alerts</span>
                <Switch
                  checked={settings.precipitationAlerts}
                  onCheckedChange={(checked) => updateSettings({ precipitationAlerts: checked })}
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">About</h3>
            <div className="text-sm text-gray-600 space-y-2">
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
