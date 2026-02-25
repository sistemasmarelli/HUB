import { registerLocaleData } from '@angular/common';
import { Component, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PoMenuItem } from '@po-ui/ng-components';
import localePt from '@angular/common/locales/pt';
import localePt2 from '@angular/common/locales/extra/pt';


registerLocaleData(localePt, localePt2);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [    
    RouterOutlet,   
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    }
  ]
})
export class AppComponent {
  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.onClick.bind(this) },
  ];

  private onClick() {
    alert('Clicked in menu item');
  }
}
