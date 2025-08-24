// Google OAuth Types

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface GoogleUserInfo {
  isSignedIn: boolean;
  profile: GoogleUserProfile;
  accessToken: string | null;
}

export interface GoogleOAuthParams {
  access_token?: string;
  expires_in?: string;
  token_type?: string;
  scope?: string;
  state?: string;
  [key: string]: string | undefined;
}

export interface GoogleUserInfoResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  locale?: string;
}