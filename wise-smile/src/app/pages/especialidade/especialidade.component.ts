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

  // Um "Getter" atua como se fosse uma variável dinâmica no HTML. 
  // Toda vez que você muda o 'filtroStatus' na tela, o HTML re-lê isso aqui,
  // e a lista se atualiza magicamente mostrando apenas os Ativos ou Inativos.
  get especialidadesFiltradas() {
    if (this.filtroStatus === 'ATIVOS') return this.listaEspecialidades.filter(e => e.ativo === true);
    if (this.filtroStatus === 'INATIVOS') return this.listaEspecialidades.filter(e => e.ativo === false);
    return this.listaEspecialidades; 
  }

  inativar(id: number) {
    if (confirm('ATENÇÃO: Deseja inativar esta especialidade?')) {
      this.especialidadeService.deletar(id).subscribe({
        next: () => { alert('Especialidade inativada!'); this.carregarEspecialidades(); },
        error: (err: any) => alert('Falha ao inativar.')
      });
    }
  }


  ativar(id: number) {
    if (confirm('Deseja reativar esta especialidade?')) {
      this.especialidadeService.ativar(id).subscribe({
        next: () => { alert('Especialidade reativada!'); this.carregarEspecialidades(); },
        error: (err: any) => alert('Falha ao reativar.')
      });
    }
  }


  
}