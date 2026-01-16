/**
 * HTTP client for API communication
 * @author Matteo Owona, Rouchda Yampen
 * @date 2024-12-05
 */

// Définir l'interface ApiError localement pour éviter les problèmes d'import
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

class HttpClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    // Correction : Utiliser une valeur par défaut si la variable d'env n'est pas définie
    // On retire le /api final car les endpoints dans API_ENDPOINTS commencent déjà par /api
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private getAuthToken(): string | null {
    // Vérifier si on est dans un environnement navigateur
    if (typeof window === 'undefined') return null;

    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.warn('Cannot access localStorage:', error);
      return null;
    }
  }

  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...customHeaders,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        code: `HTTP_${response.status}`,
        message: response.statusText,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.details = errorData.details;
      } catch {
        // Si la réponse n'est pas du JSON, essayer de lire le texte
        try {
          const text = await response.text();
          if (text) {
            error.message = text;
          }
        } catch {
          // Garder le message par défaut
        }
      }

      throw error;
    }

    // Vérifier si la réponse a du contenu
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      // Pour les réponses non-JSON, retourner un objet vide
      return {} as T;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Correction : S'assurer que l'endpoint commence par un slash
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.buildHeaders(options?.headers),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.buildHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.buildHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.buildHeaders(options?.headers),
      ...options,
    });

    return this.handleResponse<T>(response);
  }

  // Méthode pour faciliter la construction des requêtes avec paramètres
  async request<T>(method: string, endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(options?.headers),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    return this.handleResponse<T>(response);
  }
}

export const httpClient = new HttpClient();