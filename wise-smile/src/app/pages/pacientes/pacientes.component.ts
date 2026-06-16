import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../services/paciente.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent implements OnInit {
  
  listaPacientes: any[] = [];
  filtroStatus: string = 'TODOS';

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.carregarPacientes();
  }

  carregarPacientes() {
    this.pacienteService.listar().subscribe({
      next: (dados) => {
        this.listaPacientes = dados;
      },
      error: (err) => console.error('Erro ao carregar pacientes', err)
    });
  }

  get pacientesFiltrados() {
    if (this.filtroStatus === 'ATIVOS') {
      return this.listaPacientes.filter(p => p.ativo === true);
    } else if (this.filtroStatus === 'INATIVOS') {
      return this.listaPacientes.filter(p => p.ativo === false);
    }
    return this.listaPacientes; 
  }

  excluir(id: number, nome: string) {
    const confirmacao = confirm(`ATENÇÃO: Tem certeza que deseja inativar o paciente ${nome}?`);

    if (confirmacao) {
      this.pacienteService.deletar(id).subscribe({
        next: () => {
          alert('Paciente inativado com sucesso!');
          this.carregarPacientes(); 
        },
        error: (err) => {
          console.error('Erro ao inativar', err);
          alert('Falha ao inativar o paciente.');
        }
      });
    }
  }
  // Ativar paciente
  ativar(id: number, nome: string) {
    const confirmacao = confirm(`Deseja reativar o cadastro do paciente ${nome}?`);

    if (confirmacao) {
      this.pacienteService.ativar(id).subscribe({
        next: () => {
          alert('Paciente reativado com sucesso!');
          this.carregarPacientes(); // Atualiza a tabela dinamicamente
        },
        error: (err) => {
          console.error('Erro ao reativar', err);
          alert('Falha ao reativar o paciente.');
        }
      });
    }
  }
}