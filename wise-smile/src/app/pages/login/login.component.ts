import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; //Habilita a leitura de formulários 
import { AuthService } from '../../services/auth.service'; // Importa o arquivo auth.service.ts
import { Router } from '@angular/router';


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
// Chama o auth.service.ts quando a tela é carregada
  constructor(private authService: AuthService,private router: Router) {}

  fazerLogin() {
    //Chama o auth.service.ts e o (subscribe) para ficar à espera da resposta do Java
    this.authService.fazerLogin(this.credenciais).subscribe({
      next: (resposta) => {
        // Se a senha estiver certa, o Java devolve o código 200 e entra aqui
        console.log(' Login efetuado com sucesso! Token recebido:' , resposta);
        localStorage.setItem('token', resposta.token);
        this.router.navigate(['/inicio']);
      },
      error: (erro) => {
        // Se a senha estiver errada, o Java devolve código 400/403 e entra aqui
        console.error('Falha no acesso', erro);
        alert('Erro: Utilizador ou senha incorretos.');
      }
    });
  }

}

