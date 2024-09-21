export type AccessToken = {
  accessToken: string;
  type: string;
  expiresIn?: number | string;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type GoogleCredentials = {
  code: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export type GoogleTokens = {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
};
