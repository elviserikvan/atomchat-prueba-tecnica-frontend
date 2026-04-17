import { environment } from '@/environment/environment';

export const API_AUTH_ROUTES = {
  EMAIL_LOGIN: `${environment.url}/auth/email-login`,
  FIREBASE_LOGIN: `${environment.url}/auth/firebase-login`,
};
