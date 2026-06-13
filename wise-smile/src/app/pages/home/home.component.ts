import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; //importando

@Component({
  selector: 'app-home',
  imports: [RouterLink], // conectado no componente aqui
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}