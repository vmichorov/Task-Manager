import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
  }
  post(uri: string, data: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, data);
  }
  patch(uri: string, data: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, data);
  }
  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }
  login(email: string, password: string) {
    return this.http.post(
      `${this.ROOT_URL}/users/login`,
      {
        email,
        password,
      },
      {
        observe: 'response',
      }
    );
  }
}
