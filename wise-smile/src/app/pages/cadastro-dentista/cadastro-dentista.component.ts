import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { DentistaService } from '../../services/dentista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialidadeService } from '../../services/especialidade.service';

@Component({
  selector: 'app-cadastro-dentista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-dentista.component.html',
  styleUrl: './cadastro-dentista.component.scss'
})
export class CadastroDentistaComponent implements OnInit {

  tituloPagina: string = 'Novo Dentista';
  dentistaIdParaEdicao: number | null = null;

  // Atualizado: agora inicia com um array vazio de especialidades
  dentista: any = {
    nome: '',
    cro: '',
    especialidades: [] 
  };
  
  listaEspecialidades: any[] = [];
  
  constructor(
    private dentistaService: DentistaService,
    private router: Router,
    private route: ActivatedRoute, 
    private especialidadeService: EspecialidadeService
  ) {}

  ngOnInit() {
    // 1. Busca todas as especialidades ativas no banco de dados para montar os checkboxes
    this.especialidadeService.listar().subscribe({
      next: (dados: any) => {
        this.listaEspecialidades = dados.filter((e: any) => e.ativo === true);
      },
      error: (err: any) => console.error('Erro ao carregar especialidades', err)
    });

    // 2. Lógica para verificar se é uma Edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dentistaIdParaEdicao = Number(id);
      this.tituloPagina = 'Editar Dentista';

      this.dentistaService.buscarPorId(this.dentistaIdParaEdicao).subscribe({
        next: (dados) => this.dentista = dados,
        error: (err) => console.error('Erro ao carregar dentista', err)
      });
    }
  }

  // Verifica se o dentista já tem essa especialidade (usado na edição para deixar a caixa marcada)
  isEspecialidadeSelecionada(idEspecialidade: number): boolean {
    if (!this.dentista.especialidades) return false;
    return this.dentista.especialidades.some((e: any) => e.id === idEspecialidade);
  }

  // Adiciona ou remove a especialidade na lista do dentista quando o usuário clica
  toggleEspecialidade(especialidade: any, event: any) {
    if (!this.dentista.especialidades) {
      this.dentista.especialidades = [];
    }

    if (event.target.checked) {
      this.dentista.especialidades.push({ id: especialidade.id, nome: especialidade.nome });
    } else {
      this.dentista.especialidades = this.dentista.especialidades.filter((e: any) => e.id !== especialidade.id);
    }
  }

  salvar()  {
    if (this.dentistaIdParaEdicao) {
      this.dentistaService.atualizar(this.dentistaIdParaEdicao, this.dentista).subscribe({
        next: ()   => {
          alert('Dentista atualizado com sucesso!');
          this.router.navigate(['/dentistas']);
        },
        error: (err) => alert('Falha ao atualizar dentista.')
      });  
    } else {
      this.dentistaService.cadastrar(this.dentista).subscribe({
        next: () => { 
          alert('Dentista cadastrado com sucesso!');
          this.router.navigate(['/dentistas']);
        },
        error: (err) => alert('Falha ao registrar o dentista.')
      });
    }
  }
}