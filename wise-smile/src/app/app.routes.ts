import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  // Rota raiz (quando não tem nada na URL, carrega a Home)
  { path: '', component: HomeComponent },
  
  // Rota de login
  { path: 'login', component: LoginComponent }
];