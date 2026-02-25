import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { PendProdComponent } from './pendProd/pendProd.component';
import { WhiteComponent } from './white/white.component';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'auth', component: AuthComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
      { path: 'pendProd', component: PendProdComponent },
      { path: 'white', component: WhiteComponent },
    ]
  }
];
