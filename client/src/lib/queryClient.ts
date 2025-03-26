import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    
    try {
      // Try to parse the error as JSON
      const errorData = await res.json();
      
      // Use detailed error message if available
      if (errorData.message) {
        errorMessage = errorData.message;
        
        // Include details if available
        if (errorData.details) {
          errorMessage += ` (${errorData.details})`;
        }
      } else {
        // Fallback to stringifying the entire error response
        errorMessage = JSON.stringify(errorData);
      }
    } catch (e) {
      // If it's not JSON, use text or status text
      errorMessage = (await res.text()) || res.statusText;
    }
    
    // Create an error with detailed information
    const error = new Error(`${errorMessage}`);
    (error as any).status = res.status;
    (error as any).statusText = res.statusText;
    
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
