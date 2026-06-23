import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgendamentoService } from '../../services/agendamento.service'; 

@Component({
  selector: 'app-inicio',
  standalone: true, 
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit {


  consultasDoDia: any[] = [];
  dataAtual = new Date(); 

  constructor(
    private router: Router,
    private agendamentoService: AgendamentoService 
  ) {}

  // Dispara automaticamente quando a página de Início carrega
  ngOnInit() {
    this.carregarAgendaDashboard();
  }

carregarAgendaDashboard() {
    this.agendamentoService.listar().subscribe({
      next: (dados) => {
        
        //Data de hoje
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataHojeParaFiltro = `${ano}-${mes}-${dia}`;

        // 2. Filtra a lista para manter APENAS as consultas de hoje
        const apenasHoje = dados.filter(consulta => {
          if (!consulta.dataInicio) return false;
          const dataConsulta = consulta.dataInicio.substring(0, 10);
          return dataConsulta === dataHojeParaFiltro;
        });

        
        this.consultasDoDia = apenasHoje.slice(0, 5);
      },
      error: (err) => console.error('Erro ao carregar a agenda no dashboard', err)
    });
  }

  // Evento de sair da tela
  sair(event: Event) {
    event.preventDefault(); 
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }

  datahoje(){
    const hoje = new Date();
    return hoje;
  }
}