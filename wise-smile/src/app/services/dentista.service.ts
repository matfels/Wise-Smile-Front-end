
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// O @Injectable avisa ao Angular que esse serviço é global ('root'). 
// Qualquer tela pode "chamá-lo" sem precisar criar uma nova instância (Single Pattern).
@Injectable({providedIn: 'root'}) 
export class DentistaService {
  
  // A rota principal para os controladores de Dentistas no Spring Boot.
  private apiUrl = 'http://localhost:8081/dentistas'; 

  constructor(private http: HttpClient) { }

  cadastrar(dentista: any): Observable<any> { 
    const token = localStorage.getItem('token');
    
    // Anexa a chave JWT de segurança para provar que o usuário está logado e tem permissão.
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Dispara o POST enviando o novo dentista.
    return this.http.post(this.apiUrl, dentista, { headers });

    
  }
  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // GET na porta 8081 para puxar todos os dentistas para marcar a consulta
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Rota especial: Pede pro Java trazer apenas os dentistas que têm uma especialidade específica.
  buscarPorEspecialidade(idEspecialidade: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/especialidade/${idEspecialidade}`, { headers });
  }
  deletar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  ativar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/ativar`, {}, { headers });
  }

  // Busca um único dentista pelo ID
  buscarPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  // Atualiza os dados do dentista
  atualizar(id: number, dentista: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, dentista, { headers });
  }

  
}