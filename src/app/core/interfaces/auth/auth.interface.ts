export interface IUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface IEmailLoginResponse {
  exists: boolean;
  created: boolean;
  accessToken: string | null;
  expiresIn: number | null;
  expiresAt: string | null;
  user: IUser | null;
}
