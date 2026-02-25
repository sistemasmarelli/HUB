import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { PoMenuItem, PoModule, PoMenuPanelModule, PoMenuPanelItem  } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [PoModule, PoTemplatesModule, FormsModule, CommonModule, RouterOutlet, PoMenuPanelModule ], 
})



export class HomeComponent implements OnInit {

  //menus: Array<PoMenuItem> = [];  // Agora mutável
  menus: Array<PoMenuPanelItem> = [];

  constructor(private router: Router) {}

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
    this.menus.push({ label: 'Sair', link: '/', icon: 'po-icon-exit' });

  }
  
}

