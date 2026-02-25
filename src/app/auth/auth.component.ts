import { Component, OnInit, HostListener, ViewChild, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';
import { AuthHttpService } from './auth-http.service';
import { PoPageLogin, PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


import { HttpClient } from '@angular/common/http';
import { PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [PoModule, PoTemplatesModule, FormsModule, CommonModule ],  
})
export class AuthComponent implements OnInit {
  [x: string]: any;
  login: string;
  password: string;
  imagemFundo: string;
  alturaImagemFundo: string;
  userAuthData: string;



  constructor(
    private router: Router,
    private authHttpService: AuthHttpService,
    private poNotification: PoNotificationService,
    private http: HttpClient,
    private poDialog: PoDialogService  ) {}

  ngOnInit() {
    this.restore();
    //this.setTamanhoImagem();
  }
  

  @HostListener('window:resize', ['$event'])
  /*
  setTamanhoImagem() {
    this.alturaImagemFundo = '100%';
    if (window.innerWidth > window.innerHeight) {
      if (window.innerWidth <= 480) {
        this.imagemFundo = './assets/login_background_480.png';
      } else {
        if (window.innerWidth > 480 && window.innerWidth <= 960) {
          this.imagemFundo = './assets/login_background_480.png';
        } else {
          if (window.innerWidth > 960 && window.innerWidth <= 1366) {
            this.imagemFundo = './assets/login_background_960.png';
          } else {
            if (window.innerWidth > 1366) {
              this.imagemFundo = './assets/login_background_1600.png';
              this.alturaImagemFundo = 'fit-content';
            }
          }
        }
      }
    } else {
      if (window.innerWidth <= 480) {
        this.imagemFundo = './assets/Mobile_S.png';
      } else {
        if (window.innerWidth > 480 && window.innerWidth <= 960) {
          this.imagemFundo = './assets/Mobile_S.png';
        } else {
          if (window.innerWidth > 960 && window.innerWidth <= 1366) {
            this.imagemFundo = './assets/Mobile_L.png';
          } else {
            if (window.innerWidth > 1366) {
              this.imagemFundo = './assets/Mobile_L.png';
            }
          }
        }
      }
    }
  }
*/


  onClickAcessar(event: PoPageLogin) {
  this.authHttpService.login(event.login, event.password).subscribe({
    next: (res) => {
      
      console.log('pos login: ', res)
      // Supondo que res já seja um objeto (sem necessidade de JSON.parse)
      if (res.items && res.items[0].status === 'ok') {
         this.router.navigate(['/home/pendProd/']);
      } else {
          const status = res.items?.[0]?.status || 'desconhecido';
          this.poNotification.error(`Erro: ${status}`);
      }
      
    },

    error: (erro) => {
      const erroMsg = erro?.error?.error_description || 'Erro inesperado';
      this.poNotification.error(`Erro: ${erroMsg}`);
    }
  });
}
  





  restore() {
    this.login = '';
    this.password = '';
    localStorage.clear();
    sessionStorage.clear();
  }

  /*
  loginSubmit(formData: PoPageLogin) {

    this.userAuthData = btoa(formData.login + ':' + formData.password);

    let myHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Basic ${this.userAuthData}`
    });

    //Também podemos adicionar um header usando o Append da forma abaixo:
    myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');
    myHeaders = myHeaders.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    myHeaders = myHeaders.append('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    myHeaders = myHeaders.append('codigobarras', '0');  // claudio. para que esse comando?

    const options = { headers: myHeaders };


    this.http
      .get(environment.api + 'login', options)
      .subscribe({
        next: () => {

         this.router.navigate(['/home/pendProd']); 
        },
        error: () => {
          this.poDialog.alert({
            title: 'ERRO',
            message: 'Usuário ou senha inválido'
          });
        }
      })
  }
      */
}
