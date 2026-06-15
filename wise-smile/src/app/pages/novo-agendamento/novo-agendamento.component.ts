import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { DentistaService } from '../../services/dentista.service';
import { AgendamentoService } from '../../services/agendamento.service'; // Importação do agendamento.service.ts
@Component({
  selector: 'app-novo-agendamento',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './novo-agendamento.component.html',
  styleUrl: './novo-agendamento.component.scss'
})
export class NovoAgendamentoComponent implements OnInit {

  //Variaveis de lista para receber as informações "pacientes e dentistas"
  listaPacientes: any[] = [];
  listaDentistas: any[] = [];


  // Estrutura do payload que será enviado para o Java
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
    private router: Router
  ) {}

 // Essa função roda assim que a tela abre
ngOnInit() {
    // 1. Bloqueio de datas no passado
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
    this.pacienteService.listar().subscribe({
      next: (dados) => this.listaPacientes = dados,
      error: (err) => console.error('Erro ao carregar pacientes', err)
    });

    this.dentistaService.listar().subscribe({
      next: (dados) => this.listaDentistas = dados,
      error: (err) => console.error('Erro ao carregar dentistas', err)
    });
  }
  salvar() {
    // Validar se a data e hora informadas já passaram do momento atual
    const dataHoraSelecionada = new Date(`${this.agendamento.data}T${this.agendamento.hora}`);
    if (dataHoraSelecionada < new Date()) {
      alert('Não é permitido agendar uma consulta no passado!');
      return; // Interrompe a função aqui, não envia para o Java
    }

// Calcula duração (1 hora)
    const dataInicioFormatada = `${this.agendamento.data}T${this.agendamento.hora}:00`;
    const dataFimObj = new Date(dataHoraSelecionada);
    dataFimObj.setHours(dataFimObj.getHours() + 1);
    
    const horaFim = String(dataFimObj.getHours()).padStart(2, '0');
    const minutoFim = String(dataFimObj.getMinutes()).padStart(2, '0');
    const dataFimFormatada = `${this.agendamento.data}T${horaFim}:${minutoFim}:00`;

    // Monta o payload final cruzando as chaves primárias
    const payload = {
          paciente: {
            id: parseInt(this.agendamento.idPaciente)
          },
          dentista: {
            id: parseInt(this.agendamento.idDentista)
          },
          usuario: {
            id: this.idUsuarioLogado
          },
          descricao: this.agendamento.descricao,
          dataInicio: dataInicioFormatada,
          dataEnding: dataFimFormatada 
        };

    this.agendamentoService.cadastrar(payload).subscribe({
      next: () => {
        alert('Consulta agendada com sucesso!');
        this.router.navigate(['/inicio']); 
      },
      error: (erro) => {
        console.error('Erro retornado pelo Java:', erro);
        alert(erro.error?.message || 'Erro ao agendar. Verifique horários conflitantes.');
      }
    });
  }}