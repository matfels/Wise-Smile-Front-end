import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service'; // Importação do agendamento.service.ts
import { DentistaService } from '../../services/dentista.service';
import { EspecialidadeService } from '../../services/especialidade.service'; // Importação do especialidade.service.ts
import { PacienteService } from '../../services/paciente.service';


@Component({
  selector: 'app-novo-agendamento',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './novo-agendamento.component.html',
  styleUrl: './novo-agendamento.component.scss'
})
export class NovoAgendamentoComponent implements OnInit {

  // Variáveis para guardar os dados vindos do Back-end, preenchendo os "Selects" (caixas de seleção) na tela.
  listaPacientes: any[] = [];
  listaEspecialidades: any[] = [];
  // Dividimos os dentistas em duas listas para podermos aplicar o filtro de especialidade sem perder os dados originais.
  listaDentistasOriginal: any[] = []; 
  listaDentistasFiltrados: any[] = [];  
  idEspecialidadeSelecionada: string = '';
  // Esse é o "molde" (payload) onde vamos montando a consulta conforme o usuário preenche o formulário.
  agendamento = {
    idPaciente: '',
    idDentista: '',
    data: '',
    hora: '',
    descricao: '' 
  }  ;

  dataMinima: string = '';
  idUsuarioLogado: number = 0;

  //Injeção de dependências via construtor
  constructor(
    private agendamentoService: AgendamentoService, 
    private pacienteService: PacienteService,
    private dentistaService: DentistaService,
    private especialidadeService: EspecialidadeService, // coloca o serviço especialidade.service.ts
    private router: Router
  ) {}

 // Essa função roda assim que a tela abre
  ngOnInit() {
    // 1. Bloqueio de datas no passado:
    // Pegamos a data exata de hoje e formatamos no padrão do HTML (YYYY-MM-DD).
    // Isso será usado na tela (min="{{dataMinima}}") para impedir agendamentos retroativos.
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    this.dataMinima = `${ano}-${mes}-${dia}`;

    // 2. Recupera o ID do Usuário logado (Aquele que fez o Login)
    const idSalvo = localStorage.getItem('idUsuario');
    this.idUsuarioLogado = idSalvo ? parseInt(idSalvo) : 6; 

    // 3. Busca os dados reais do seu banco
    this.carregarDados();
  }
  carregarDados() {
    this.pacienteService.listar().subscribe(dados => this.listaPacientes = dados);
    
    // Carrega as especialidades
    this.especialidadeService.listar().subscribe(dados => this.listaEspecialidades = dados);

    // Carrega os dentistas e guarda na lista Original
    this.dentistaService.listar().subscribe(dados => {
      this.listaDentistasOriginal = dados;
      // No início, a lista filtrada é igual à original (mostra todos)
      this.listaDentistasFiltrados = dados; 
    });
  }

  // FUNÇÃO DO FILTRO INTELIGENTE DE DENTISTAS
  filtrarDentistas() {
    // Se o usuário selecionou "Todas as Especialidades" (deixou vazio), devolvemos a lista inteira de dentistas.
    if (!this.idEspecialidadeSelecionada) {
      this.listaDentistasFiltrados = this.listaDentistasOriginal;
      return;
    }

    const idBuscado = parseInt(this.idEspecialidadeSelecionada);

    // Dispara a requisição para o banco de dados fazer o JOIN
    this.dentistaService.buscarPorEspecialidade(idBuscado).subscribe({
      next: (dados) => {
        this.listaDentistasFiltrados = dados;
        this.agendamento.idDentista = ''; // Reseta o campo do Dentista para obrigar a escolher um novo
      },
      error: (err) => console.error('Erro ao buscar dentistas por especialidade', err)
    });
  }

  salvar() {
    // Esses console.logs são ferramentas valiosas para você (desenvolvedor) checar no F12 se os dados estão corretos.
    console.log('1. O botão de salvar foi acionado!');
    console.log('Dados capturados da tela:', this.agendamento);

    // 1. TRAVA DE SEGURANÇA: Verifica se os campos obrigatórios estão vazios
    if (!this.agendamento.idPaciente || !this.agendamento.idDentista || !this.agendamento.data || !this.agendamento.hora) {
      alert('Por favor, preencha todos os campos (Paciente, Dentista, Data e Hora) antes de confirmar.');
      return; 
    }

    // 2. Validação: Bloqueia agendamentos no passado
    const dataHoraSelecionada = new Date(`${this.agendamento.data}T${this.agendamento.hora}`);
    if (dataHoraSelecionada < new Date()) {
      alert('Não é permitido agendar uma consulta no passado!');
      return;
    }

    // 3. Cálculo Automático de Duração:
    // O Back-end precisa saber a hora de término. Pegamos a hora escolhida e automaticamente somamos 1 hora a ela.
    const dataInicioFormatada = `${this.agendamento.data}T${this.agendamento.hora}:00`;
    
    const dataFimObj = new Date(dataHoraSelecionada);
    dataFimObj.setHours(dataFimObj.getHours() + 1); 
    
    const horaFim = String(dataFimObj.getHours()).padStart(2, '0');
    const minutoFim = String(dataFimObj.getMinutes()).padStart(2, '0');
    const dataFimFormatada = `${this.agendamento.data}T${horaFim}:${minutoFim}:00`;

    // 4. Montagem do Pacote Final (Payload):
    // O Spring Boot espera objetos aninhados (ex: paciente: { id: X }). Aqui formatamos tudo do jeitinho que o Java gosta.
    const payload = {
      paciente: { id: parseInt(this.agendamento.idPaciente) },
      dentista: { id: parseInt(this.agendamento.idDentista) },
      usuario: { id: this.idUsuarioLogado }, // ID capturado no Login
      descricao: this.agendamento.descricao,
      dataInicio: dataInicioFormatada,
      dataEnding: dataFimFormatada
    };

    console.log('2. Payload pronto para a rede:', payload);

    // 5. Dispara a requisição POST para o Java
    this.agendamentoService.cadastrar(payload).subscribe({
      next: () => {
        alert('Consulta agendada com sucesso!');
        this.router.navigate(['/inicio']); 
      },
      error: (erro) => {
        console.error('Erro retornado pelo Java:', erro);
        // Se o Java chiar (por exemplo, dentista ocupado nesse horário), mostramos a mensagem de erro que veio de lá!
        alert(erro.error?.message || 'Falha ao agendar. Verifique horários conflitantes.');
      }
    });
  }
}