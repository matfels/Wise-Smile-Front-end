import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DentistaService } from '../../services/dentista.service';

@Component({
  selector: 'app-dentistas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dentistas.component.html',
  styleUrl: './dentistas.component.scss'
})
export class DentistasComponent implements OnInit {
  
  listaDentistas: any[] = [];
  filtroStatus: string = 'TODOS';

  constructor(private dentistaService: DentistaService) {}

  ngOnInit() {
    this.carregarDentistas();
  }

  carregarDentistas() {
    this.dentistaService.listar().subscribe({
      next: (dados) => this.listaDentistas = dados,
      error: (err) => console.error('Erro ao carregar dentistas', err)
    });
  }

  get dentistasFiltrados() {
    if (this.filtroStatus === 'ATIVOS') return this.listaDentistas.filter(d => d.ativo === true);
    if (this.filtroStatus === 'INATIVOS') return this.listaDentistas.filter(d => d.ativo === false);
    return this.listaDentistas; 
  }

  excluir(id: number, nome: string) {
    if (confirm(`ATENÇÃO: Tem certeza que deseja inativar o dentista ${nome}?`)) {
      this.dentistaService.deletar(id).subscribe({
        next: () => { alert('Dentista inativado!'); this.carregarDentistas(); },
        error: (err) => alert('Falha ao inativar.')
      });
    }
  }

  ativar(id: number, nome: string) {
    if (confirm(`Deseja reativar o cadastro do dentista ${nome}?`)) {
      this.dentistaService.ativar(id).subscribe({
        next: () => { alert('Dentista reativado!'); this.carregarDentistas(); },
        error: (err) => alert('Falha ao reativar.')
      });
    }
  }
}