export type AccessToken = {
  accessToken: string;
  type: string;
  expiresIn?: number | string;
};

export type UserCredentials = {
  email: string;
  password: string;
};
