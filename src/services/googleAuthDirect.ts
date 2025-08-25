// Direct OAuth 2.0 implementation without Google Sign-In SDK
import type {
  GoogleUserInfo,
  GoogleOAuthParams,
  GoogleUserInfoResponse
} from '../types/google-auth';
import { GOOGLE_CLIENT_ID } from '../config/google';

class GoogleAuthDirect {
  private clientId: string;
  private redirectUri: string;
  private scope: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  constructor() {
    this.clientId = GOOGLE_CLIENT_ID;
    // Use the correct redirect URI based on the current location
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    // For GitHub Pages, ensure we include the /TimeSync path WITHOUT trailing slash
    // to match Google Cloud Console settings
    this.redirectUri = origin.includes('github.io') && pathname.includes('/TimeSync') 
      ? `${origin}/TimeSync`  // No trailing slash to match Google Console
      : origin.includes('localhost:5174')
      ? 'http://localhost:5174'  // Exact match for localhost
      : origin.includes('192.168')
      ? `${origin.replace(/\/$/, '')}`  // Remove any trailing slash
      : `${origin}${pathname.replace(/\/$/, '')}`;  // Remove trailing slash
    // Add userinfo scopes for profile access
    this.scope = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    
    // Check for token in URL hash (OAuth callback)
    this.handleCallback();
    
    // Check for stored token
    this.loadStoredToken();
  }

  private handleCallback() {
    const hash = window.location.hash;
    
    if (hash && hash.includes('access_token')) {
      // Parse the hash fragment
      const hashParams = hash.substring(1).split('&');
      const params: GoogleOAuthParams = {};
      
      hashParams.forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
      });
      
      const accessToken = params.access_token;
      const expiresIn = params.expires_in;
      
      if (accessToken) {
        this.accessToken = accessToken;
        
        if (expiresIn) {
          this.tokenExpiresAt = Date.now() + parseInt(expiresIn) * 1000;
        }
        
        // Store token
        this.storeToken();
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Reload to apply new token
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }

  private storeToken() {
    if (this.accessToken && this.tokenExpiresAt) {
      sessionStorage.setItem('google_access_token', this.accessToken);
      sessionStorage.setItem('google_token_expires_at', this.tokenExpiresAt.toString());
    }
  }

  private loadStoredToken() {
    const storedToken = sessionStorage.getItem('google_access_token');
    const storedExpiry = sessionStorage.getItem('google_token_expires_at');
    
    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      if (expiryTime > Date.now()) {
        this.accessToken = storedToken;
        this.tokenExpiresAt = expiryTime;
      } else {
        // Token expired, clear storage
        this.clearToken();
      }
    }
  }

  private clearToken() {
    this.accessToken = null;
    this.tokenExpiresAt = null;
    sessionStorage.removeItem('google_access_token');
    sessionStorage.removeItem('google_token_expires_at');
  }

  signIn() {
    // Log OAuth config for debugging (will be removed in production)
    console.log('OAuth Client ID:', this.clientId);
    console.log('OAuth Redirect URI:', this.redirectUri);
    
    // Build OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', this.clientId);
    authUrl.searchParams.set('redirect_uri', this.redirectUri);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', this.scope);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', 'state_parameter_passthrough_value');
    
    // Redirect to Google OAuth
    window.location.href = authUrl.toString();
  }

  signOut() {
    this.clearToken();
    // Optionally revoke token
    if (this.accessToken) {
      fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).catch(() => {
        // Silently ignore revoke errors
      });
    }
  }

  isSignedIn(): boolean {
    return !!(this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > Date.now());
  }

  getAccessToken(): string | null {
    if (this.isSignedIn()) {
      return this.accessToken;
    }
    return null;
  }

  async getCurrentUser(): Promise<GoogleUserInfo | null> {
    if (!this.isSignedIn()) {
      return null;
    }

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        // Clear invalid token
        this.clearToken();
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json() as GoogleUserInfoResponse;
      return {
        isSignedIn: true,
        profile: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          imageUrl: userInfo.picture
        },
        accessToken: this.accessToken
      };
    } catch {
      return null;
    }
  }

  // Make authenticated API requests
  async makeApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.isSignedIn()) {
      throw new Error('Not authenticated');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${this.accessToken}`);

    return fetch(url, {
      ...options,
      headers
    });
  }
}

const googleAuthDirect = new GoogleAuthDirect();
export default googleAuthDirect;