import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service'; 

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss'
})
export class CadastroUsuarioComponent {

  tituloPagina: string = 'Novo Usuário';

  usuario: any = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfil: 'Comum'
  
  };

  constructor(
    private usuarioService: UsuarioService, // <-- Serviço injetado!
    private router: Router
  ) {}



  salvar() {
    this.usuarioService.cadastrar(this.usuario).subscribe({
      next: () => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/inicio']);
  
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        alert('Falha ao registrar o usuário. Verifique os dados e tente novamente.');
      }
    });
  
  
  }
}