import { appTokenCache } from './auth';

const API_BASE_URL = "http://192.168.68.104:8080";

if(!API_BASE_URL){
    throw new Error(
        'API_BASE_URL is not defined. Please define it in .env.local'
    )
}

class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

interface FetchApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
    isRefreshRequest?: boolean;
}

export const fetchApi = async <T = any>(
    endpoint: string,
    options: FetchApiOptions = {}
): Promise<T> => {
    const {
        method = 'GET',
        body,
        headers = {},
        requiresAuth = false,
        isRefreshRequest = false
    } = options;

    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`[fetchApi] ${method} ${url}`);

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    // Add authentication header if required
    if (requiresAuth && !isRefreshRequest) {
        const token = await appTokenCache?.getToken('token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    // Add token for refresh requests
    if (isRefreshRequest) {
        const token = await appTokenCache?.getToken('token');
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(
                errorData.message || `HTTP ${response.status}`,
                response.status,
                errorData.errors
            );
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Network error occurred', 0);
    }
};