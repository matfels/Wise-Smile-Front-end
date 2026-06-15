import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

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

  constructor(private router: Router) {}

  salvar() {
    console.log('Dados do paciente prontos para envio:', this.paciente);
    // Aqui entrará o PacienteService futuramente!
    alert('Paciente montado com sucesso! Verifique o console.');
  }

}