import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../services/agendamento.service';
import { CommonModule } from '@angular/common'; // Necessário se usar DatePipe para formatar datas
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Adicionado para os filtros funcionarem

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // <-- FormsModule adicionado aqui
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss'
})
export class AgendaComponent implements OnInit {
  
  listaConsultas: any[] = [];

  // Variáveis para capturar o que o usuário digitar nos filtros
  filtroPaciente: string = '';
  filtroDentista: string = '';
  filtroStatus: string = 'TODOS';

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

  // Lógica inteligente que cruza os três filtros em tempo real
get consultasFiltradas() {
    return this.listaConsultas.filter(consulta => {
      
      // 1. Captura os nomes com segurança (tenta os dois formatos comuns do Spring Boot)
      const nomePac = (consulta.paciente?.nome || consulta.pacienteNome || '').toString().toLowerCase();
      const nomeDent = (consulta.dentista?.nome || consulta.dentistaNome || '').toString().toLowerCase();
      
      // 2. Padroniza o status que vem do banco para tudo MAIÚSCULO
      const statusConsulta = (consulta.status || '').toString().toUpperCase();

      // 3. Captura o que você digitou nos filtros (tudo minúsculo para comparar direito)
      const buscaPac = this.filtroPaciente.trim().toLowerCase();
      const buscaDent = this.filtroDentista.trim().toLowerCase();
      const buscaStatus = this.filtroStatus.toUpperCase();

      // 4. Faz os testes
      const matchPaciente = nomePac.includes(buscaPac);
      const matchDentista = nomeDent.includes(buscaDent);
      const matchStatus = buscaStatus === 'TODOS' || statusConsulta === buscaStatus;

      // Só exibe a linha se passar nos três filtros
      return matchPaciente && matchDentista && matchStatus;
    });
  } 
}