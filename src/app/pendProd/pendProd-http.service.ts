import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendProdHttpService {
  constructor(
      private httpClient: HttpClient
  ) { }

  buscaPendProd(linha: string): Observable<any> {
    
    //let cnpj = localStorage.getItem('cnpj');
    let myHeaders = new HttpHeaders;
    
    myHeaders = myHeaders.append('linha',  linha);
    /*
    myHeaders = myHeaders.append('datEmisFin',   formatDate(dt_emi_f, 'dd-MM-yyyy', 'pt-BR'));
    myHeaders = myHeaders.append('datVenctoIni', formatDate(dt_ven, 'dd-MM-yyyy', 'pt-BR'));
    myHeaders = myHeaders.append('datVenctoFin', formatDate(dt_ven_f, 'dd-MM-yyyy', 'pt-BR'));
    */

    const options = {
      headers: myHeaders
    };

    return this.httpClient.get(environment.apiProgress + 'pendenciasProd', {
      ...options, });
  }

  

  formatarData(data: any): string {
    if (!(data instanceof Date)) {
      data = new Date(data);
    }
    
    if (isNaN(data.getTime())) {
      return 'Data inválida';
    }

    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;




  }
    
}
