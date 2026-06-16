import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { CommonModule } from '@angular/common'; // Necessário se usar DatePipe para formatar datas
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit {
  
  listaConsultas: any[] = [];

  constructor(private agendamentoService: AgendamentoService) {}

  ngOnInit() {
    this.carregarConsultas();
  }

  carregarConsultas() {
    this.agendamentoService.listar().subscribe({
      next: (dados) => {
        this.listaConsultas = dados;
      },
      error: (err) => console.error('Erro ao carregar a agenda', err)
    });

  }

  cancelar(idConsulta: number) {
    // A função prompt abre uma janela nativa do navegador pedindo o texto
    const motivo = prompt('REGRA DE NEGÓCIO: Qual o motivo do cancelamento? (Obrigatório)');

    // trava se o usuário clicou em Cancelar no prompt ou deixou vazio 
    if (!motivo || motivo.trim() === '') {
      alert('Operação abortada: O motivo é obrigatório para cancelar uma consulta!');
      return;

    }

    // Se tem motivo, dispara o pacote para o Java
    this.agendamentoService.cancelarConsulta(idConsulta, motivo).subscribe({
      next: () => {

        alert('Consulta cancelada com sucesso!');
        this.carregarConsultas(); // Atualiza a tabela na tela automaticamente
      },
      error: (err) => {
        console.error('Erro ao cancelar', err);
        alert('Falha ao cancelar a consulta.');
      }
    });
  }
}