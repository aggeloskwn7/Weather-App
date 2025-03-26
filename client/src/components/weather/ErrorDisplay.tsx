import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ 
  message = "We couldn't retrieve the weather information. Please check your connection or try again later.", 
  onRetry 
}: ErrorDisplayProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-red-500 bg-opacity-20 p-2 mr-3">
            <AlertCircle className="text-red-500 h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Unable to load weather data</h3>
        </div>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end">
          <Button onClick={onRetry}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
