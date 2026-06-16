import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; // importa tela login
import { HomeComponent } from './pages/home/home.component'; // importa tela home
import { InicioComponent } from './pages/inicio/inicio.component'; // importa tela inicio 
import { CadastroDentistaComponent } from './pages/cadastro-dentista/cadastro-dentista.component'; //importa tela cadastro dentista
import { CadastroPacienteComponent } from './pages/cadastro-paciente/cadastro-paciente.component';
import { NovoAgendamentoComponent } from './pages/novo-agendamento/novo-agendamento.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component'; //importa tela pacientes
import { DentistasComponent } from './pages/dentistas/dentistas.component';
import { EspecialidadeComponent } from './pages/especialidade/especialidade.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';



export const routes: Routes = [
  // Rota raiz (quando não tem nada na URL, carrega a Home)
  { path: '', component: HomeComponent },
  
  // Rota de login
  { path: 'login', component: LoginComponent },

  // rota inicio
  { path: 'inicio', component: InicioComponent },

  { path: 'cadastro-dentista', component: CadastroDentistaComponent },

  { path: 'cadastro-dentista/:id', component: CadastroDentistaComponent },

  { path: 'cadastro-paciente', component: CadastroPacienteComponent },
  
  { path: 'novo-agendamento', component: NovoAgendamentoComponent },

  { path: 'agenda', component: AgendaComponent },

  { path: 'pacientes', component: PacientesComponent },

  { path: 'dentistas', component: DentistasComponent },

  { path: 'cadastro-paciente/:id', component: CadastroPacienteComponent },

  { path: 'especialidade', component: EspecialidadeComponent },

  { path: 'cadastro-usuario', component: CadastroUsuarioComponent }
 
  


];