import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
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

  // Busca todas as consultas
  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });


  }

  // Enviamos o comando de cancelamento com o motivo
  cancelarConsulta(id: number, motivo: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const parametros = new HttpParams().set('motivo', motivo);
    // Supondo que a sua rota seja PUT /consultas/{id}/cancelar e receba um JSON com o motivo
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, null, { headers: headers, params: parametros });
  }
}