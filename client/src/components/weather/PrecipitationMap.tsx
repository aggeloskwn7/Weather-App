import React from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, Maximize } from "lucide-react";

interface MapProps {
  latitude: number;
  longitude: number;
  isLoading: boolean;
}

export default function PrecipitationMap({ latitude, longitude, isLoading }: MapProps) {
  const { mapView, setMapView } = useWeather();
  
  if (isLoading) {
    return (
      <section className="bg-white py-6 px-4 shadow-sm mb-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
          
          <Skeleton className="w-full h-[300px] rounded-lg" />
          
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </section>
    );
  }
  
  // OpenWeatherMap map layers
  // Documentation: https://openweathermap.org/api/weather-map-2
  const getMapUrl = () => {
    const mapBase = "https://tile.openweathermap.org/map";
    const zoom = 10;
    const apiKey = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY";
    
    let layer = "";
    switch (mapView) {
      case "radar":
        layer = "precipitation_new";
        break;
      case "satellite":
        layer = "clouds_new";
        break;
      case "temperature":
        layer = "temp_new";
        break;
      default:
        layer = "precipitation_new";
    }
    
    return `${mapBase}/${layer}/${zoom}/${latitude}/${longitude}.png?appid=${apiKey}`;
  };
  
  return (
    <section className="bg-white py-6 px-4 shadow-sm mb-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">Precipitation Map</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={mapView === "radar" ? "default" : "outline"}
              onClick={() => setMapView("radar")}
              className="px-2 py-1 text-xs font-medium"
            >
              Radar
            </Button>
            <Button
              size="sm"
              variant={mapView === "satellite" ? "default" : "outline"}
              onClick={() => setMapView("satellite")}
              className="px-2 py-1 text-xs font-medium"
            >
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapView === "temperature" ? "default" : "outline"}
              onClick={() => setMapView("temperature")}
              className="px-2 py-1 text-xs font-medium"
            >
              Temp
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg overflow-hidden relative" style={{ height: "300px" }}>
          <div className="w-full h-full flex items-center justify-center bg-blue-100 bg-opacity-20">
            {latitude && longitude ? (
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.1}%2C${latitude-0.1}%2C${longitude+0.1}%2C${latitude+0.1}&amp;layer=mapnik`}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Weather Map"
              ></iframe>
            ) : (
              <div className="text-center">
                <i className="fas fa-map text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500">Weather map will be displayed once a location is selected</p>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-3 right-3 bg-white rounded-md shadow-md p-2">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span>Source: OpenWeatherMap</span>
        </div>
      </div>
    </section>
  );
}
