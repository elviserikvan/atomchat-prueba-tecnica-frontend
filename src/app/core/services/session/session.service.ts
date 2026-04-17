import { Injectable } from '@angular/core';
import { NgStorage } from '../../enums/ngStorage/ngStorage.enum';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private readonly storageService: StorageService) {}

  async getUserEmail(): Promise<string | null> {
    const value = await this.storageService.getStorage(NgStorage.USER_EMAIL);
    return typeof value === 'string' ? value : null;
  }

  async getAccessToken(): Promise<string | null> {
    const value = await this.storageService.getStorage(NgStorage.TOKEN);
    return typeof value === 'string' ? value : null;
  }

  async getTokenExpiresAt(): Promise<string | null> {
    const value = await this.storageService.getStorage(
      NgStorage.TOKEN_EXPIRES_AT,
    );
    return typeof value === 'string' ? value : null;
  }

  async hasValidSession(): Promise<boolean> {
    const token = await this.getAccessToken();
    const expiresAt = await this.getTokenExpiresAt();

    if (!token || !expiresAt) {
      return false;
    }

    const expiresAtTime = new Date(expiresAt).getTime();

    if (Number.isNaN(expiresAtTime) || expiresAtTime <= Date.now()) {
      await this.clear();
      return false;
    }

    return true;
  }

  async setSession(params: {
    email: string;
    accessToken: string;
    expiresAt: string;
  }): Promise<void> {
    await this.storageService.setStorage(NgStorage.USER_EMAIL, params.email);
    await this.storageService.setStorage(NgStorage.TOKEN, params.accessToken);
    await this.storageService.setStorage(
      NgStorage.TOKEN_EXPIRES_AT,
      params.expiresAt,
    );
  }

  async clear(): Promise<void> {
    await this.storageService.deleteStorage(NgStorage.USER_EMAIL);
    await this.storageService.deleteStorage(NgStorage.TOKEN);
    await this.storageService.deleteStorage(NgStorage.TOKEN_EXPIRES_AT);
  }
}
