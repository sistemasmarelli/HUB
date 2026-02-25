import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthHttpService } from './auth-http.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
  constructor(private session: AuthHttpService, 
             private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.session.isAuthenticated()
      ? true
      : this.router.parseUrl('/login');
  }
}