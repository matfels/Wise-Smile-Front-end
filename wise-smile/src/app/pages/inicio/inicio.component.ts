import { Component } from '@angular/core';
import { Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  constructor(private router: Router) {}


  // Evento de sair da tela, direcionando para a tela login novamente.
  sair(event: Event) {
    event.preventDefault(); 
    localStorage.removeItem('token'); // Apaga o Token da memória do navegador
    this.router.navigate(['/login']); // Joga o usuário de volta para o login
  }
}
