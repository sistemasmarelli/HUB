import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PoModule, PoMenuPanelModule, PoMenuPanelItem, PoDialogService } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { AuthHttpService } from '../auth/auth-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [PoModule, PoTemplatesModule, FormsModule, CommonModule, RouterOutlet, PoMenuPanelModule,
            FormsModule,
            CommonModule,
            PoTemplatesModule,
            PoModule
   ], 
})


export class HomeComponent implements OnInit {

  //menus: Array<PoMenuItem> = [];  // Agora mutável
  menus: Array<PoMenuPanelItem> = [];
  
  constructor(private router: Router,
              private poDialog: PoDialogService,
              private session: AuthHttpService) {}

  /*
  readonly menus: Array<PoMenuItem> = [
    { label: 'Exibe Duplicaas', shortLabel: 'Duplicatas', icon: 'po-icon-finance-secure', link: './titulos' },
    { label: 'Alterar Senha', shortLabel: 'Senha', icon: 'po-icon-settings', link: './senha' },
    { label: 'Sair', link: '/', icon: 'po-icon-exit', }
  ];
  */

  ngOnInit(): void {
    
    this.menus.push({ label: 'Pendências de Produção',  icon: 'po-icon-manufacture', link: './pendProd' });
    /*this.menus.push({ label: 'Beneficiamento', shortLabel: 'Beneficiamento', icon: 'po-icon-pallet-full', link: './terceiros' });
    this.menus.push({ label: 'Ordens Produção', shortLabel: 'OrdensProducao', icon: 'po-icon-finance-secure', link: './ordem-terc' });
    this.menus.push({ label: 'Alterar Senha', shortLabel: 'Senha', icon: 'po-icon-settings', link: './senha' });*/
    this.menus.push({ label: 'Sair' /* , link: '/' */ , action: () => this.sair(), icon: 'po-icon-exit' });

  }

  sair(): void {

    console.log('sair')
    
    this.poDialog.confirm({
      title: 'Sair',
      message: 'Deseja sair da aplicação?',
      confirm: () => {
        // ajuste aqui conforme sua estratégia (rota, logout, limpar storage etc.)
        // Ex.: window.location.href = '/';
        localStorage.removeItem('auth');
        this.session.logout();
        this.router.navigateByUrl('/', { replaceUrl: true });
        //window.location.reload();
        
      }
    });
  }
  
}

