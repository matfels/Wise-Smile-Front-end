import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; //Habilita a leitura de formulários 

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {


  //Variaveis com o mesmo nome no arquivo DadosAutenticacao.java (Evitar erros na conver~sao para JSON)
  credenciais = {
    email: '',
    senha: ''

  };


  fazerLogin() {
    console.log('Dados prontos para enviar ao Java:', this.credenciais);
  }

}