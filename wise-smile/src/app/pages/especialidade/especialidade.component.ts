import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EspecialidadeService } from '../../services/especialidade.service';

@Component({
  selector: 'app-especialidade',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './especialidade.component.html',
  styleUrl: './especialidade.component.scss'
})
export class EspecialidadeComponent implements OnInit {
  
  listaEspecialidades: any[] = [];
  filtroStatus: string = 'TODOS';

  constructor(private especialidadeService: EspecialidadeService) {}

  ngOnInit() {
    this.carregarEspecialidades();
  }

  carregarEspecialidades() {
    this.especialidadeService.listar().subscribe({
      next: (dados) => this.listaEspecialidades = dados,
      error: (err) => console.error('Erro ao carregar especialidades', err)
    });
  }

  get especialidadesFiltradas() {
    if (this.filtroStatus === 'ATIVOS') return this.listaEspecialidades.filter(e => e.ativo === true);
    if (this.filtroStatus === 'INATIVOS') return this.listaEspecialidades.filter(e => e.ativo === false);
    return this.listaEspecialidades; 
  }

  excluir(id: number, nome: string) {
    if (confirm(`ATENÇÃO: Deseja inativar a especialidade ${nome}?`)) {
      this.especialidadeService.deletar(id).subscribe({
        next: () => { alert('Especialidade inativada!'); this.carregarEspecialidades(); },
        error: (err) => alert('Falha ao inativar.')
      });
    }
  }

  ativar(id: number, nome: string) {
    if (confirm(`Deseja reativar a especialidade ${nome}?`)) {
      this.especialidadeService.ativar(id).subscribe({
        next: () => { alert('Especialidade reativada!'); this.carregarEspecialidades(); },
        error: (err) => alert('Falha ao reativar.')
      });
    }
  }
}