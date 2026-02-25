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

}
