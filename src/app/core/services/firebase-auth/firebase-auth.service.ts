import { Injectable } from '@angular/core';
import { environment } from '@/environment/environment';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private getFirebaseApp() {
    if (getApps().length) {
      return getApps()[0];
    }

    const { apiKey, authDomain, projectId, appId } = environment.firebase;

    if (!apiKey || !authDomain || !projectId || !appId) {
      throw new Error(
        'Firebase no está configurado en environment.ts. Completa apiKey, authDomain, projectId y appId.',
      );
    }

    return initializeApp(environment.firebase);
  }

  async signInWithGoogle(): Promise<string> {
    const app = this.getFirebaseApp();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    return result.user.getIdToken();
  }

  async logout(): Promise<void> {
    if (!getApps().length) {
      return;
    }

    await signOut(getAuth(getApps()[0]));
  }
}
