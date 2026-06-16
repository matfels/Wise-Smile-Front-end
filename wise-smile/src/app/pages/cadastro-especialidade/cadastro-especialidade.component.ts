import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EspecialidadeService } from '../../services/especialidade.service';

@Component({
  selector: 'app-cadastro-especialidade',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-especialidade.component.html',
  styleUrl: './cadastro-especialidade.component.scss'
})
export class CadastroEspecialidadeComponent implements OnInit {

  tituloPagina: string = 'Nova Especialidade';
  especialidadeIdParaEdicao: number | null = null;

  especialidade: any = {
    nome: '',
    ativo: true
  };

  constructor(
    private especialidadeService: EspecialidadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.especialidadeIdParaEdicao = Number(id);
      this.tituloPagina = 'Editar Especialidade';

      this.especialidadeService.buscarPorId(this.especialidadeIdParaEdicao).subscribe({
        next: (dados) => this.especialidade = dados,
        error: (err: any) => console.error('Erro ao carregar especialidade:', err) // <-- Ajustado aqui
      });
    }
  }

  salvar() {
    if (this.especialidadeIdParaEdicao) {
      // MODO EDIÇÃO
      this.especialidadeService.atualizar(this.especialidadeIdParaEdicao, this.especialidade).subscribe({
        next: () => {
          alert('Especialidade atualizada com sucesso!');
          this.router.navigate(['/especialidades']); 
        },
        error: (err: any) => { // <-- Ajustado aqui
          console.error('Erro ao atualizar:', err);
          alert('Falha ao atualizar a especialidade.');
        }
      });
    } else {
      // MODO CADASTRO
      this.especialidadeService.cadastrar(this.especialidade).subscribe({
        next: () => {
          alert('Especialidade cadastrada com sucesso!');
          this.router.navigate(['/especialidades']); 
        },
        error: (err: any) => { // <-- Ajustado aqui
          console.error('Erro ao cadastrar:', err);
          alert('Falha ao cadastrar a especialidade.');
        }
      });
    }
  }}