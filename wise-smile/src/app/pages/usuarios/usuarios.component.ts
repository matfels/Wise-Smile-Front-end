import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  filtroStatus: string = 'todos';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.filtrar(); // Aplica o filtro inicial
      },
      error: (err) => console.error('Erro ao listar usuários', err)
    });
  }

  filtrar() {
    if (this.filtroStatus === 'ativos') {
      this.usuariosFiltrados = this.usuarios.filter(u => u.ativo);
    } else if (this.filtroStatus === 'inativos') {
      this.usuariosFiltrados = this.usuarios.filter(u => !u.ativo);
    } else {
      this.usuariosFiltrados = [...this.usuarios];
    }
  }

  inativarUsuario(id: number) {
    if (confirm('Tem certeza que deseja inativar este usuário?')) {
      this.usuarioService.deletar(id).subscribe({
        next: () => {
          alert('Usuário inativado com sucesso!');
          this.carregarUsuarios();
        },
        error: (err) => alert('Erro ao inativar usuário.')
      });
    }
  }

  ativarUsuario(id: number) {
    if (confirm('Deseja reativar este usuário?')) {
      this.usuarioService.ativar(id).subscribe({
        next: () => {
          alert('Usuário ativado com sucesso!');
          this.carregarUsuarios();
        },
        error: (err) => alert('Erro ao ativar usuário.')
      });
    }
  }
}