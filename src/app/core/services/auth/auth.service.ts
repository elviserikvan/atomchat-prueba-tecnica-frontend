import { Injectable } from '@angular/core';
import { API_AUTH_ROUTES } from '../../api-routes/auth/auth.routes';
import { IEmailLoginResponse } from '../../interfaces/auth/auth.interface';
import { RequestMethod } from '../../enums/httpRequest/requestMethods.enum';
import { GlobalHttpService } from '../globalHttp/global-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends GlobalHttpService {
  async login(email: string, createIfMissing = false): Promise<IEmailLoginResponse> {
    return this.makeRequest<
      IEmailLoginResponse,
      { email: string; createIfMissing: boolean }
    >(
      API_AUTH_ROUTES.EMAIL_LOGIN,
      { email, createIfMissing },
      RequestMethod.POST,
    );
  }

  async firebaseLogin(idToken: string): Promise<IEmailLoginResponse> {
    return this.makeRequest<IEmailLoginResponse, { idToken: string }>(
      API_AUTH_ROUTES.FIREBASE_LOGIN,
      { idToken },
      RequestMethod.POST,
    );
  }
}
