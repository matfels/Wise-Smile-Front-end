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
  filtroStatus: string = 'TODOS'; // Começa mostrando todos

  constructor(private pacienteService: PacienteService) {}

  ngOnInit() {
    this.carregarPacientes();
  }

  carregarPacientes() {
    this.pacienteService.listar().subscribe( {
      next: (dados) => {
        this.listaPacientes = dados;
      },
      error: (err) => console.error('Erro ao carregar pacientes', err)
    });
  }
  // função ´para o filtro. O HTML le os dados daqui.
  get pacientesFiltrados() {
    if (this.filtroStatus === 'ATIVOS') {
      return this.listaPacientes.filter(p => p.ativo === true);
    } else if (this.filtroStatus === 'INATIVOS') {
      return this.listaPacientes.filter(p => p.ativo === false);
    }
    return this.listaPacientes; // Se for todos
  }


  excluir(id: number, nome: string) {
    const confirmacao = confirm(`ATENÇÃO: Tem certeza que deseja excluir o paciente ${nome}?`);

    if (confirmacao) {
      this.pacienteService.deletar(id).subscribe(
        {
        next: () => {
          alert('Paciente excluído com sucesso!');
          this.carregarPacientes(); // Atualiza a tabela na mesma hora
        },
        error: (err) => {
          console.error('Erro ao excluir', err);
          alert('Falha ao excluir o paciente.');
        }
      });
    }


  }
}