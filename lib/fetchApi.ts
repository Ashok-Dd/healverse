import { API_URL as API_BASE_URL } from "@/constants/api";
import { ApiResponse } from '@/types/type';
import { appTokenCache } from './auth';
import { showToast } from './toast';


if(!API_BASE_URL){
    throw new Error(
        'API_BASE_URL is not defined. Please define it in .env.local'
    )
}

interface FetchApiOptions extends Omit<RequestInit, 'method' | 'body' | 'headers'> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | "HEAD";
    body?: any | FormData;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
    isRefreshRequest?: boolean;
    suppressToasts?: boolean; // Option to disable automatic toasts
    timeout?: number; // Request timeout in milliseconds
}



// Endpoints that call the AI provider: typically 5-20 s, so they get a longer default timeout.
const AI_ENDPOINT_PATTERN =
    /^\/api\/(diet-plans\/generate|food-logs\/log\/|conversations\/[^/]+\/messages)/;
const DEFAULT_TIMEOUT_MS = 30000;
const AI_TIMEOUT_MS = 60000;

// Registered by authStore (avoids a circular import). Called when an authenticated
// request comes back 401, i.e. the token is missing, expired or invalid.
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
    unauthorizedHandler = handler;
};

// Friendly text for statuses where the server body may be missing or too technical.
const friendlyMessage = (status: number, serverMessage?: string): string => {
    if (status === 429) {
        return serverMessage || "Too many requests. Please wait a moment and try again.";
    }
    if (status === 502) {
        return serverMessage || "The AI service is busy right now. Please try again in a moment.";
    }
    if (status === 410) {
        return serverMessage || "This feature is currently unavailable.";
    }
    if (status >= 500) {
        return "Something went wrong on our side. Please try again.";
    }
    return serverMessage || `HTTP ${status}`;
};

export class ApiError extends Error {
    public readonly status: number;
    public readonly response?: any;

    constructor(message: string, status: number, response?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.response = response;
    }
}

// Helper function to create timeout promise
const createTimeoutPromise = (timeout: number): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
    });
};

// Helper function to safely get auth token
const getAuthToken = async (): Promise<string | null> => {
    try {
        return await appTokenCache?.getToken("token") ?? null;
    } catch (error) {
        console.warn('[fetchApi] Failed to retrieve auth token:', error);
        return null;
    }
};

// Helper function to handle response parsing
const parseResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
    const contentType = response.headers.get('content-type');
    
    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
        return {
            success: response.ok,
            message: response.ok ? 'Success' : `HTTP ${response.status}: ${response.statusText}`,
            data: null as T,
        };
    }

    try {
        return await response.json();
    } catch (error) {
        console.warn('[fetchApi] Failed to parse JSON response:', error);
        return {
            success: false,
            message: 'Invalid JSON response',
            data: null as T,
            error: 'JSON_PARSE_ERROR'
        };
    }
};

// Main fetchApi function
export const fetchApi = async <T = unknown>(
    endpoint: string,
    options: FetchApiOptions = {}
): Promise<T> => {
    const {
        method = "GET",
        body,
        headers = {},
        requiresAuth = false,
        isRefreshRequest = false,
        suppressToasts = true,
        timeout = AI_ENDPOINT_PATTERN.test(endpoint) ? AI_TIMEOUT_MS : DEFAULT_TIMEOUT_MS,
        ...restOptions
    } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    // Build request configuration
    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...restOptions,
    };

    // Add authentication if required
    if (requiresAuth || isRefreshRequest) {
        const token = await getAuthToken();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        } else if (requiresAuth && !suppressToasts) {
            showToast("Authentication required but no token found", { type: "error" });
            throw new ApiError("No authentication token available", 401);
        }
    }

    // Handle request body
    if (body && method !== "GET" && method !== "HEAD") {
        if (body instanceof FormData) {
            // Remove Content-Type to let browser set boundary for FormData
            const { "Content-Type": _, ...headersWithoutContentType } = config.headers as Record<string, string>;
            config.headers = headersWithoutContentType;
            config.body = body;
        } else if (typeof body === 'string') {
            config.body = body;
        } else {
            config.body = JSON.stringify(body);
        }
    }

    try {
        // Create fetch promise with timeout
        const fetchPromise = fetch(url, config);
        const timeoutPromise = createTimeoutPromise(timeout);
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        // Parse response
        const parsedResponse = await parseResponse<T>(response);

        // Handle HTTP errors
        if (!response.ok) {
            // Any authenticated call that gets 401 means the session is over.
            if (response.status === 401 && requiresAuth) {
                unauthorizedHandler?.();
            }

            const errorMessage = friendlyMessage(response.status, parsedResponse.message);
            
            if (!suppressToasts) {
                showToast(errorMessage, { type: "error" });
            }
            
            throw new ApiError(
                errorMessage,
                response.status,
                parsedResponse
            );
        }

        // Handle API-level errors (when HTTP is OK but API reports failure)
        if (!parsedResponse.success) {
            const errorMessage = parsedResponse.message || parsedResponse.error || "Request failed";
            
            if (!suppressToasts) {
                showToast(errorMessage, { type: "error" });
            }
            
            throw new ApiError(errorMessage, response.status, parsedResponse);
        }

        // Show success toast if enabled and message exists
        if (!suppressToasts && parsedResponse.message) {
            showToast(parsedResponse.message, { type: "success" });
        }

        // console.log("[fetchApi] Response:", parsedResponse);

        return parsedResponse.data;

    } catch (error) {
        // Handle different types of errors
        if (error instanceof ApiError) {
            throw error; // Re-throw API errors as-is
        }

        const isTimeout = (error as any)?.message === 'Request timeout';
        const isNetworkError = error instanceof TypeError || isTimeout;
        const errorMessage = isTimeout
            ? "The request took too long. Please try again."
            : isNetworkError
                ? "Can't reach the server. Check your connection and try again."
                : "An unexpected error occurred";

        console.error("[fetchApi] Error:", error);
        
        if (!suppressToasts) {
            showToast(errorMessage, { type: "error" });
        }

        throw new ApiError(
            isNetworkError ? errorMessage : error instanceof Error ? error.message : errorMessage,
            isNetworkError ? 0 : 500,
            error
        );
    }
};