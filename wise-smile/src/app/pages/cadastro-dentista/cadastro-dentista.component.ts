import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { DentistaService } from '../../services/dentista.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  dentista: any = {
    nome: '',
    cro: '',
    especialidadeId: '' 
  };

  constructor(
    private dentistaService: DentistaService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
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

  
  toggleEspecialidade(param1?: any, param2?: any) {
      if (typeof param1 === 'number' || typeof param1 === 'string') {
      this.dentista.especialidadeId = param1;
    } else if (param2 && (typeof param2 === 'number' || typeof param2 === 'string')) {
      this.dentista.especialidadeId = param2;
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