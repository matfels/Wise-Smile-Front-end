import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // importa tela login
import { HomeComponent } from './pages/home/home.component'; // importa tela home
import { InicioComponent } from './pages/inicio/inicio.component'; // importa tela inicio 
export const routes: Routes = [
  // Rota raiz (quando não tem nada na URL, carrega a Home)
  { path: '', component: HomeComponent },
  
  // Rota de login
  { path: 'login', component: LoginComponent },

  // rota inicio
  { path: 'inicio', component: InicioComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' } // redireciona para o inivio caso não tenha o hrl correto.
];