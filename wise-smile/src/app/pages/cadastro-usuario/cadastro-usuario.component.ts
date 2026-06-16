import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Injetamos o ActivatedRoute
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss'
})
export class CadastroUsuarioComponent implements OnInit {

  tituloPagina: string = 'Novo Usuário';
  usuarioIdParaEdicao: number | null = null; // Variável para controlar a edição

  usuario: any = {
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfil: 'Comum'
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute // Ferramenta que lê a URL
  ) {}

  ngOnInit() {
    // abririndo a tela, verifica se tem um ID na URL (ex: /cadastro-usuario/5)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioIdParaEdicao = Number(id);
      this.tituloPagina = 'Editar Usuário';

      // Vai no Java buscar os dados desse usuário para preencher a tela
      this.usuarioService.buscarPorId(this.usuarioIdParaEdicao).subscribe({
        next: (dados) => this.usuario = dados,
        error: (err) => console.error('Erro ao carregar usuário', err)
      });
    }
  }
  
salvar() {
    // 1. Criamos um pacote "limpo" apenas com os dados da tabela
    const payloadLimpo = {
      nome: this.usuario.nome,
      cpf: this.usuario.cpf,
      email: this.usuario.email,
      senha: this.usuario.senha,
      perfil: this.usuario.perfil,
      ativo: this.usuario.ativo
    };

    if (this.usuarioIdParaEdicao) {
      // Se encontra ID, faz o UPDATE (Atualizar) enviando o pacote limpo
      this.usuarioService.atualizar(this.usuarioIdParaEdicao, payloadLimpo).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']); // Volta pra lista
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          alert('Falha ao atualizar o usuário.');
        }
      });
    } else {
      // Se não tem ID, faz o POST (Cadastrar) enviando o pacote limpo
      this.usuarioService.cadastrar(payloadLimpo).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/usuarios']); // Volta pra lista
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          alert('Falha ao registrar o usuário. Verifique os dados.');
        }
      });
    }
  }  


}