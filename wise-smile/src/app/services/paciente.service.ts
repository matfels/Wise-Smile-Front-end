import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  
  // Rota no Spring Boot para PacientesController.java
  private apiUrl = 'http://localhost:8081/pacientes'; 

  constructor(private http: HttpClient) { }

  
  cadastrar(paciente: any): Observable<any> {
    // Pega o Token do localStorage
    const token = localStorage.getItem('token');
    
  // Configura o cabeçalho de segurança
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    

    //  Dispara o pacote para o back-end
    return this.http.post(this.apiUrl, paciente, { headers });
  }

  listar(): Observable<any[]>  {
    const token = localStorage.getItem('token' );
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // GET na porta 8081 para puxar todos os pacientes para marcar a consulta
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}