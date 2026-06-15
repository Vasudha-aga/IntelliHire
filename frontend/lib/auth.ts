export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  auth_provider?: string;
}

const AUTH_TOKEN_KEY = 'intellihire_token';
const AUTH_USER_KEY = 'intellihire_user';

export const auth = {
  login: (token: string, user?: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }
    }
  },
  setUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
  isAuthenticated: (): boolean => {
    return auth.getToken() !== null;
  }
};
