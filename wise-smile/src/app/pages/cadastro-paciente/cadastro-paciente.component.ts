import { Component, OnInit } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro-paciente.component.html',
  styleUrl: './cadastro-paciente.component.scss'
})
export class CadastroPacienteComponent implements OnInit { 

  paciente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: ''
  };

  pacienteIdParaEdicao: number | null = null; 

  //Injetamos o ActivatedRoute no constructor
  constructor(
    private pacienteService: PacienteService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}



  ngOnInit() {
    // Ao carregar , verifica se tem um ID na URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteIdParaEdicao = Number(id);
      this.pacienteService.buscarPorId(this.pacienteIdParaEdicao).subscribe({
        next: (dados) => this.paciente = dados,
        error: (err) => console.error('Erro ao carregar paciente para edição', err)
      });
    }

  }

  salvar() {

    if (this.pacienteIdParaEdicao) {
      // Se existe ID, chama o atualizar
      this.pacienteService.atualizar(this.pacienteIdParaEdicao, this.paciente).subscribe({
        next: () => {
          alert('Paciente atualizado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (err) => {
          console.error('Erro ao atualizar', err);
          alert('Falha ao atualizar o paciente.');
        }
      });
    } else {
      // Se nao existe ID, faz o seu cadastro normal
      this.pacienteService.cadastrar(this.paciente).subscribe({
        next: (resposta) => {
          alert('Paciente cadastrado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (erro) => {
          console.error('Erro ao cadastrar paciente:', erro);
          alert('Falha ao registrar o paciente.');
        }
      });
    }

    
  }
}