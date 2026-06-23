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
    // 1. Prepara a tela buscando as especialidades ativas.
    // Fazemos um '.filter' para garantir que o recepcionista não vincule o dentista a uma especialidade inativa.
    this.especialidadeService.listar().subscribe({
      next: (dados: any) => {
        this.listaEspecialidades = dados.filter((e: any) => e.ativo === true);
      },
      error: (err: any) => console.error('Erro ao carregar especialidades', err)
    });

    // 2. Lógica de "Dupla Função" (Cadastro x Edição):
    // Lemos a URL da página. Se houver um 'id' na rota (ex: /dentistas/editar/5), sabemos que o usuário quer EDITAR.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dentistaIdParaEdicao = Number(id);
      this.tituloPagina = 'Editar Dentista';

      // Vai no Back-end, busca os dados daquele dentista específico e preenche a tela automaticamente.
      this.dentistaService.buscarPorId(this.dentistaIdParaEdicao).subscribe({
        next: (dados) => this.dentista = dados,
        error: (err) => console.error('Erro ao carregar dentista', err)
      });
    }
  }

  // Função chamada pelo HTML (nos checkboxes) para descobrir se a caixinha deve aparecer marcada ou não.
  isEspecialidadeSelecionada(idEspecialidade: number): boolean {
    if (!this.dentista.especialidades) return false;
    // 'some()' percorre a lista e retorna 'true' se encontrar o ID.
    return this.dentista.especialidades.some((e: any) => e.id === idEspecialidade);
  }

  // Essa função escuta toda vez que o usuário clica num Checkbox de Especialidade.
  toggleEspecialidade(especialidade: any, event: any) {
    // Prevenção de erro: garante que o array existe antes de usá-lo.
    if (!this.dentista.especialidades) {
      this.dentista.especialidades = [];
    }

    if (event.target.checked) {
      // Se ele MARCOU a caixa, empurramos (push) a especialidade pra dentro do array.
      this.dentista.especialidades.push({ id: especialidade.id, nome: especialidade.nome });
    } else {
      // Se ele DESMARCOU a caixa, nós recriamos o array tirando apenas a especialidade que ele desmarcou.
      this.dentista.especialidades = this.dentista.especialidades.filter((e: any) => e.id !== especialidade.id);
    }
  }

  salvar()  {
    // O pulo do gato: Se for edição, chama o Atualizar (PUT). Se for novo, chama o Cadastrar (POST).
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