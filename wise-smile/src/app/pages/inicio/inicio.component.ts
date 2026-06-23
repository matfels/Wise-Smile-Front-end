import { Component } from '@angular/core';
import { Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  // O Router nos ajuda a "navegar" entre as telas do sistema via código
  constructor(private router: Router) {}

  // Evento de sair da tela, direcionando para a tela login novamente.
  sair(event: Event) {
    event.preventDefault(); // Impede o link de tentar recarregar a página ou dar erro
    
    localStorage.removeItem('token'); // 1. Apaga a chave JWT (o Token) do cofre do navegador. Sem isso, a sessão morre!
    this.router.navigate(['/login']); // 2. Usa o Router para despachar o usuário de volta para a tela de Login
  }

  export class AgendaComponent implements OnInit {
  
  // Aqui guardamos a lista "original" de todas as consultas que o Back-end nos devolve
  listaConsultas: any[] = [];

  // Estas variáveis ficam ligadas ao HTML via [(ngModel)]. 
  // Tudo que o usuário digitar na tela, é atualizado aqui em tempo real.
  filtroPaciente: string = '';
  filtroDentista: string = '';
  filtroStatus: string = 'TODOS';

  constructor(private agendamentoService: AgendamentoService) {}

  // O ngOnInit é executado assim que a tela abre. Por isso, chamamos o carregamento dos dados aqui.
  ngOnInit() {
    this.carregarConsultas();
  }

  // Função que vai lá no serviço (que vai no Back-end) buscar os dados
  carregarConsultas() {
    this.agendamentoService.listar().subscribe({
      next: (dados) => {
        this.listaConsultas = dados;
      },
      error: (err) => console.error('Erro ao carregar a agenda', err)
    });
  }

  // Acionado quando o usuário clica em "Cancelar Consulta"
  cancelarConsulta(id: number) {
    // Abre uma janelinha (prompt) nativa do navegador pedindo texto
    const motivo = prompt("Por favor, digite o motivo do cancelamento:");
    
    // Verifica se o usuário escreveu alguma coisa e se não preencheu só com espaços vazios
    if (motivo && motivo.trim() !== "") {
      // Chama o seu service passando o ID e o motivo como parâmetro de URL
      this.agendamentoService.cancelarConsulta(id, motivo).subscribe({
        next: () => {
          alert("Consulta cancelada com sucesso.");
          this.carregarConsultas(); // Recarrega a lista para mostrar o novo status "CANCELADA"
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
      
      // 1. Captura os nomes do paciente e dentista garantindo que não de erro (undefined).
      // O '.toLowerCase()' converte tudo para minúsculo para facilitar a comparação depois.
      const nomePac = (consulta.paciente?.nome || consulta.pacienteNome || '').toString().toLowerCase();
      const nomeDent = (consulta.dentista?.nome || consulta.dentistaNome || '').toString().toLowerCase();
      
      // 2. Padroniza o status que vem do banco para ficar em MAIÚSCULO (como AGENDADA, FINALIZADA)
      const statusConsulta = (consulta.status || '').toString().toUpperCase();

      // 3. Captura o que o usuário digitou nos campos de texto da tela e converte para minúsculo
      const buscaPac = this.filtroPaciente.trim().toLowerCase();
      const buscaDent = this.filtroDentista.trim().toLowerCase();
      const buscaStatus = this.filtroStatus.toUpperCase();

      // 4. Faz os testes: ".includes()" verifica se o que digitamos está dentro do nome da pessoa.
      const matchPaciente = nomePac.includes(buscaPac);
      const matchDentista = nomeDent.includes(buscaDent);
      // Pro status, basta ver se a pessoa escolheu "TODOS" ou se escolheu o status exato.
      const matchStatus = buscaStatus === 'TODOS' || statusConsulta === buscaStatus;

      // 5. O '.filter' só vai manter a consulta na tela se ela der 'true' nesses três testes!
      return matchPaciente && matchDentista && matchStatus;
    });
  } 

}
