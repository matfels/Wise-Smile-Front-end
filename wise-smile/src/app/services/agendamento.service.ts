import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  // Endpoint configurado no Controller do Java
  private apiUrl = 'http://localhost:8081/consultas';

  constructor(private http: HttpClient) { }

  cadastrar(agendamento: any): Observable<any>  {
    // pega o Token JWT armazenado no Login
    const token = localStorage.getItem('token' );
    
    // Configura o cabeçalho HTTP anexando o Token de Autorização
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Dispara a requisição POST com o payload e os cabeçalhos de segurança
    return this.http.post(this.apiUrl, agendamento, { headers });
  }
}