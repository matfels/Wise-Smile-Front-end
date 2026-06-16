import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, } from '@angular/router';
import { PacienteService } from '../../services/paciente.service'; // Importe o paciente service

@Component({
  selector: 'app-cadastro-paciente',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cadastro-paciente.component.html',
  styleUrl: './cadastro-paciente.component.scss'
})
export class CadastroPacienteComponent {

  // Molde de dados (Ajuste caso seu Java peça campos diferentes)
  paciente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: ''
  };

  //Injeta o PacienteService junto com o Router
  constructor(private pacienteService: PacienteService, private router: Router) {}

  salvar() {
    // Dispara a requisição e aguarda a resposta
    this.pacienteService.cadastrar(this.paciente).subscribe({
      next: (resposta) => {
        alert('Paciente cadastrado com sucesso!');
        this.router.navigate(['/inicio']); // Redireciona de volta para o inicio
      },
      error: (erro) => {
        console.error('Erro ao cadastrar paciente:', erro);
        alert('Falha ao registrar o paciente. Verifique se os dados estão corretos.');
      }
    });
  }

}