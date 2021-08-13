import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { shareReplay, tap } from 'rxjs/operators';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webService: WebService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
      })
    );
  }
  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }
  getAccToken() {
    return localStorage.getItem('x-access-token');
  }
  setAccToken(accToken: string) {
    localStorage.setItem('x-access-token', accToken);
  }
  getRefToken() {
    return localStorage.getItem('x-refresh-token');
  }
  getUserId() {
    return localStorage.getItem('user-id');
  }
  // setRefToken(refToken: string) {
  //   localStorage.setItem('x-refresh-token', refToken);
  // }
  private setSession(userId: string, accToken: any, refToken: any) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accToken);
    localStorage.setItem('x-refresh-token', refToken);
  }
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  genNewAccToken() {
    return this.http
      .get(`${this.webService.ROOT_URL}/users/me/access-token`, {
        headers: {
          _id: this.getUserId()!,
          'x-refresh-token': this.getRefToken()!,
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccToken(res.headers.get('x-access-token')!);
        })
      );
  }
}
