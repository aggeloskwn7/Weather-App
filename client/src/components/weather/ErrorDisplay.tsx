import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, KeyRound } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ 
  message = "We couldn't retrieve the weather information. Please check your connection or try again later.", 
  onRetry 
}: ErrorDisplayProps) {
  // Check if the error is related to API key issues
  const isApiKeyError = message?.toLowerCase().includes('api key') || 
                        message?.toLowerCase().includes('unauthorized') ||
                        message?.toLowerCase().includes('authentication');

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full border">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-destructive/20 p-2 mr-3">
            <AlertCircle className="text-destructive h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Unable to load weather data</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">{message}</p>
        
        {isApiKeyError && (
          <div className="mb-6 p-4 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h4 className="font-medium text-amber-800 dark:text-amber-300">API Key Issue Detected</h4>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              We're having trouble connecting to the weather service due to an authorization issue. 
              This typically happens when the API key is invalid, expired, or not properly configured.
            </p>
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <Button 
            onClick={onRetry} 
            className="gap-2"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
