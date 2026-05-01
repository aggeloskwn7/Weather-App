import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card text-card-foreground p-5 rounded-lg shadow-lg border border-border flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-weather-accent mb-4"></div>
        <p className="font-medium text-foreground">Loading weather data...</p>
      </div>
    </div>
  );
}
