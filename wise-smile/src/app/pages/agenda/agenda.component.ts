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

  cancelarConsulta(id: number) {
    const motivo = prompt("Por favor, digite o motivo do cancelamento:");
    
    if (motivo && motivo.trim() !== "") {
      // Chama o seu service passando o ID e o motivo como parâmetro de URL
      this.agendamentoService.cancelarConsulta(id, motivo).subscribe({
        next: () => {
          alert("Consulta cancelada com sucesso.");
          this.carregarConsultas(); // Recarrega a lista
        },
        error: (err) => alert("Erro ao cancelar: " + err.error)
      });
    } else {
      alert("O motivo é obrigatório para cancelar a consulta.");
    }
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