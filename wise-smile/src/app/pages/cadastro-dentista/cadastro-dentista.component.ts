import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Importe o Router
import { DentistaService } from '../../services/dentista.service'; // Importe o novo serviço

@Component({
  selector: 'app-cadastro-dentista',
  standalone: true,
  imports: [FormsModule, RouterLink], // 1. Importa os módulos necessários
  templateUrl: './cadastro-dentista.component.html',
  styleUrl: './cadastro-dentista.component.scss'
})
export class CadastroDentistaComponent {

  //  igual da Back-end no Java
  dentista = {
    nome: '',
    email: '',
    cpf: '',
    cro: '',
    especialidadeIds: [] as number[] // Array para guardar os IDs das especialidades
  };

  // Criado Router e o nosso Service
  constructor(private dentistaService: DentistaService, private router: Router) {}

  //  Função das marcações dos checkboxes especialidades
  toggleEspecialidade(id: number, event: any) {
    if (event.target.checked) {
      // Se marcar, adiciona o ID na lista
      this.dentista.especialidadeIds.push(id);
    } else {
      //Se desmarcou, remove o ID da lista
      this.dentista.especialidadeIds = this.dentista.especialidadeIds.filter(eId => eId !== id);
    }
  }

  //Função disparada ao clicar em Salvar
  salvar() {
    // Chama o serviço e fica "escutando" a resposta do Java
    this.dentistaService.cadastrar(this.dentista).subscribe({ // subscribe arugarda o retorno não assincrono
      next: (resposta) => {
        alert('Dentista cadastrado com sucesso!');
        this.router.navigate(['/inicio']); // Joga de volta pro painel principal
      },
      error: (erro) => {
        console.error('Erro ao cadastrar:', erro);
        alert('Falha ao registrar o dentista. Verifique o console.');
      }
    });
  }

}