import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  authHeaders: HttpHeaders;
  userAuthData;

  private autenticadoSubject = new BehaviorSubject<boolean>(false);
  autenticado$ = this.autenticadoSubject.asObservable();
  
  constructor(private httpClient: HttpClient) {}

  login(usuario: string, senha: string): Observable<any> {
    
    this.userAuthData = btoa(usuario + ':' + senha);

    console.log('usuario: ', usuario)
    console.log('senha: ', senha)
    console.log('this.userAuthData: ', this.userAuthData)

    this.authHeaders = new HttpHeaders();
    this.authHeaders = this.authHeaders.append('Access-Control-Allow-Origin', '*');
    this.authHeaders = this.authHeaders.append(
      'Access-Control-Allow-Methods',
      'GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS'
    );
    this.authHeaders = this.authHeaders.append(
      'Access-Control-Allow-Headers',
      'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
    );
    this.authHeaders = this.authHeaders.append(
      'Access-Control-Expose-Headers',
      'Access-Control-Allow-Origin, Access-Control-Allow-Credentials'
    );
    this.authHeaders = this.authHeaders.append('Access-Control-Allow-Credentials', 'true');
    this.authHeaders = this.authHeaders.append('Authorization', `Basic ${this.userAuthData}`);

    const options = {
      headers: this.authHeaders
    };

   /* return this.httpClient.get(environment.apiProgress + 'login', {
      ...options,
    //  responseType: 'text'

    });*/

    return this.httpClient
      .get(environment.apiProgress + 'login', { ...options })
      .pipe(
        tap(() => {
          // Se chegou aqui, a API respondeu 200 OK
          this.autenticadoSubject.next(true);
        }),
        catchError(err => {
          this.autenticadoSubject.next(false);
          return throwError(() => err);
        })
      );    
    }


  isAuthenticated(): boolean {
    return this.autenticadoSubject.value;
  }

   /** Chame no logout */
  logout(): void {
    this.setAuthenticated(false);
  }

  private setAuthenticated(value: boolean): void {
    this.autenticadoSubject.next(value);
    //localStorage.setItem(this.storageKey, value ? 'true' : 'false');
  }    

}
