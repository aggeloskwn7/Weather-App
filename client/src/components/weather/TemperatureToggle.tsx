import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function TemperatureToggle() {
  const { settings, updateSettings } = useWeather();
  
  const handleToggle = (checked: boolean) => {
    updateSettings({
      temperatureUnit: checked ? 'metric' : 'imperial'
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">°F</span>
      <Switch 
        checked={settings.temperatureUnit === 'metric'}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-primary" 
      />
      <span className="text-sm font-medium text-muted-foreground">°C</span>
    </div>
  );
}