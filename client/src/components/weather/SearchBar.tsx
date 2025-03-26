import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWeather } from "@/contexts/WeatherContext";
import { useToast } from "@/hooks/use-toast";

interface LocationResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { setLocation } = useWeather();
  const { toast } = useToast();
  
  // Fetch location suggestions when search query changes
  const { 
    data: locationResults,
    isLoading,
    isError
  } = useQuery<LocationResult[]>({
    queryKey: [searchQuery ? `/api/weather/locations?query=${encodeURIComponent(searchQuery)}` : null],
    enabled: !!searchQuery && searchQuery.length >= 3,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 3) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleLocationSelect = (location: LocationResult) => {
    const locationName = location.state 
      ? `${location.name}, ${location.state}, ${location.country}`
      : `${location.name}, ${location.country}`;
    
    setLocation({
      lat: location.lat,
      lon: location.lon,
      name: locationName
    });
    
    setSearchQuery(locationName);
    setShowResults(false);
    
    toast({
      title: "Location updated",
      description: `Weather data loaded for ${locationName}`,
    });
  };
  
  const handleGeolocation = () => {
    if (navigator.geolocation) {
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
                const location = locationData[0];
                handleLocationSelect(location);
              }
            } else {
              toast({
                title: "Error",
                description: "Could not determine your location name",
                variant: "destructive",
              });
            }
          } catch (error) {
            toast({
              title: "Error",
              description: "Could not retrieve your location",
              variant: "destructive",
            });
          }
        },
        (error) => {
          toast({
            title: "Geolocation error",
            description: error.message || "Unable to access your location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search location..." 
          ref={searchInputRef}
          className="w-full py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          value={searchQuery}
          onChange={handleSearchInput}
          onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <i className="fas fa-search text-gray-400"></i>
        </div>
        <button 
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleGeolocation}
        >
          <i className="fas fa-location-arrow text-blue-500"></i>
        </button>
      </div>
      
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {isLoading && (
            <div className="px-4 py-3 text-gray-500 text-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Searching...
            </div>
          )}
          
          {isError && (
            <div className="px-4 py-3 text-red-500 text-center">
              <i className="fas fa-exclamation-circle mr-2"></i> Error searching locations
            </div>
          )}
          
          {!isLoading && !isError && locationResults && locationResults.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-center">
              No locations found
            </div>
          )}
          
          {locationResults?.map((location, index) => (
            <div 
              key={`${location.name}-${location.lat}-${location.lon}`}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                index < locationResults.length - 1 ? 'border-b border-gray-100' : ''
              } flex items-center`}
              onClick={() => handleLocationSelect(location)}
            >
              <i className="fas fa-map-marker-alt text-blue-500 mr-3"></i>
              <span>
                {location.name}
                {location.state && `, ${location.state}`}
                {location.country && `, ${location.country}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
