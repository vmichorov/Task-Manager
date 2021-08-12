import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from './web.service';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private webService: WebService, private router: Router) {}

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
  // setRefToken(refToken: string) {
  //   localStorage.setItem('x-refresh-token', refToken);
  // }
  private setSession(userId: string, accToken: any, refToken: any) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accToken);
    localStorage.setItem('refresh-token', refToken);
  }
  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}
