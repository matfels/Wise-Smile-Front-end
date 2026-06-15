import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-novo-agendamento',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './novo-agendamento.component.html',
  styleUrl: './novo-agendamento.component.scss'
})
export class NovoAgendamentoComponent {

  // Estrutura do payload que será enviado para o Java
  agendamento = {
    pacienteId: '',
    dentistaId: '',
    data: '',
    hora: '',
    observacoes: ''
  };

  constructor(private router: Router) {}

  salvar() {
    console.log('Dados do agendamento prontos para o Java:', this.agendamento);
    alert('Agendamento processado com sucesso! Verifique o console.');
  }

}