// Fallback authentication service for mobile devices
// This provides a localStorage-based fallback if cookies fail

const API_BASE = import.meta.env.VITE_API_URL;

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    // Check if we have a token in localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Try cookie-based login first, fallback to token-based
  async login(email: string, password: string): Promise<boolean> {
    try {
      // First attempt: Cookie-based authentication
      const cookieResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (cookieResponse.ok) {
        // Test if cookies work by checking whoami
        const testResponse = await fetch(`${API_BASE}/auth/whoami`, {
          credentials: 'include',
        });

        if (testResponse.ok) {
          console.log('✅ Cookie-based authentication working');
          return true;
        }
      }

      // Fallback: Token-based authentication
      console.log('🔄 Falling back to token-based authentication');
      const tokenResponse = await fetch(`${API_BASE}/auth/login-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (tokenResponse.ok) {
        const data = await tokenResponse.json();
        if (data.token) {
          this.token = data.token;
          localStorage.setItem('auth_token', data.token);
          console.log('✅ Token-based authentication working');
          return true;
        }
      }

      throw new Error('Both cookie and token authentication failed');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Clear cookie-based session
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('Cookie logout failed:', error);
    }

    // Clear token-based session
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async checkAuth(): Promise<boolean> {
    // First try cookie-based auth
    try {
      const cookieResponse = await fetch(`${API_BASE}/auth/whoami`, {
        credentials: 'include',
      });
      if (cookieResponse.ok) {
        return true;
      }
    } catch (error) {
      console.warn('Cookie auth check failed:', error);
    }

    // Fallback to token-based auth
    if (this.token) {
      try {
        const tokenResponse = await fetch(`${API_BASE}/auth/whoami`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        if (tokenResponse.ok) {
          return true;
        } else {
          // Token is invalid, clear it
          this.token = null;
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.warn('Token auth check failed:', error);
      }
    }

    return false;
  }

  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  getFetchConfig(): RequestInit {
    const config: RequestInit = {
      credentials: 'include', // Always try to send cookies
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    return config;
  }
}

export const authService = AuthService.getInstance();
