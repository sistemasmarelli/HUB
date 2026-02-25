import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  authHeaders: HttpHeaders;
  userAuthData;
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

    return this.httpClient.get(environment.apiProgress + 'login', {
      ...options,
    //  responseType: 'text'

    });
  }


}
