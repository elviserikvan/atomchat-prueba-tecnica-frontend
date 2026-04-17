import { environment } from '@/environment/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { catchError, from, lastValueFrom, map } from 'rxjs';
import { RequestMethod } from '../../enums/httpRequest/requestMethods.enum';
import { NgStorage } from '../../enums/ngStorage/ngStorage.enum';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalHttpService extends StorageService {
  constructor(
    public _http: HttpClient,
    storageMap: StorageMap,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    super(storageMap, platformId);
  }
  public api = environment.url;

  /**
   * Returns a promise that resolves to an HttpHeaders object containing the Authorization header with a valid bearer token.
   * If the user is not logged in, an empty HttpHeaders object is returned.
   * @returns {Promise<HttpHeaders>} A promise that resolves to an HttpHeaders object containing the Authorization header with a valid bearer token.
   */
  public async getAuthHeaders(): Promise<HttpHeaders> {
    const token = (await this.getStorage(NgStorage.TOKEN)) as string;

    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  /**
   * Performs a request to a given route with given payload and method (default to GET).
   * @param route the route to make the request to
   * @param payload the payload to send with the request
   * @param method the http request method (default to GET)
   * @returns a promise of the response
   */
  public async makeRequest<T, P>(
    route: string,
    payload: P,
    method: string = RequestMethod.GET,
  ): Promise<T> {
    return lastValueFrom(
      from(this.makeHttpRequest<T>(route, payload, method)).pipe(
        map((res) => res),
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          throw error;
        }),
      ),
    );
  }

  /**
   * Makes a http request with given options and method to the given route.
   * @param url the route to make the request to
   * @param options the options to send with the request
   * @param method the http request method (default to GET)
   * @returns a promise of the response
   */
  public async makeHttpRequest<T>(
    url: string,
    options: unknown = {},
    method: string = RequestMethod.GET,
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    const requestOptions =
      method === RequestMethod.GET
        ? { headers, params: options as Record<string, string | number | boolean> }
        : { body: options, headers };
    return lastValueFrom(
      this._http
        .request<T>(method, url, requestOptions)
        .pipe(map((response) => response as T)),
    );
  }
}
