import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWeather } from "@/contexts/WeatherContext";
import { useToast } from "@/hooks/use-toast";
import { Map, AlertTriangle, Loader2, Search, MapPin, LocateIcon } from "lucide-react";

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
    isError,
    error
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
      // Show loading toast
      toast({
        title: "Locating you",
        description: "Accessing your device location...",
      });
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Show loading toast for reverse geocoding
            toast({
              title: "Finding your location",
              description: "Converting coordinates to location name...",
            });
            
            const response = await fetch(
              `/api/weather/reverse-geocode?lat=${latitude}&lon=${longitude}`
            );
            
            if (response.ok) {
              const locationData = await response.json();
              if (locationData && locationData.length > 0) {
                const location = locationData[0];
                handleLocationSelect(location);
              } else {
                // Still use the coordinates even if we can't get the location name
                setLocation({
                  lat: latitude,
                  lon: longitude,
                  name: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`
                });
                
                toast({
                  title: "Location found",
                  description: "Using your coordinates, but couldn't retrieve location name.",
                });
              }
            } else {
              // Try to extract error message from response
              let errorMessage = "Could not determine your location name";
              try {
                const errorData = await response.json();
                if (errorData.message) {
                  errorMessage = errorData.message;
                }
              } catch (e) {
                // Ignore error parsing JSON
              }
              
              toast({
                title: "API Error",
                description: errorMessage,
                variant: "destructive",
              });
              
              // Still use the coordinates
              setLocation({
                lat: latitude,
                lon: longitude,
                name: `Latitude: ${latitude.toFixed(4)}, Longitude: ${longitude.toFixed(4)}`
              });
            }
          } catch (error) {
            console.error("Error in geolocation:", error);
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Could not retrieve your location",
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
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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

  // Get error message from the error object
  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown error occurred while searching";
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
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <button 
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleGeolocation}
          title="Use my location"
        >
          <LocateIcon className="h-4 w-4 text-blue-500 hover:text-blue-700 transition-colors" />
        </button>
      </div>
      
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute mt-1 w-full bg-card border rounded-lg shadow-lg z-20"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          {isLoading && (
            <div className="px-4 py-3 text-muted-foreground text-center flex items-center justify-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Searching locations...
            </div>
          )}
          
          {isError && (
            <div className="px-4 py-3 text-destructive text-center">
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Error searching locations</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                {getErrorMessage(error)}
              </p>
              {error instanceof Error && (error.message || '').toLowerCase().includes('api key') && (
                <p className="text-xs mt-1 p-2 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950/30 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                  Weather service API authentication issues detected. Please try again later.
                </p>
              )}
            </div>
          )}
          
          {!isLoading && !isError && locationResults && locationResults.length === 0 && (
            <div className="px-4 py-3 text-muted-foreground text-center">
              No locations found for "{searchQuery}"
            </div>
          )}
          
          {locationResults?.map((location, index) => (
            <div 
              key={`${location.name}-${location.lat}-${location.lon}`}
              className={`px-4 py-2 hover:bg-accent cursor-pointer ${
                index < locationResults.length - 1 ? 'border-b border-border' : ''
              } flex items-center`}
              onClick={() => handleLocationSelect(location)}
            >
              <MapPin className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
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
