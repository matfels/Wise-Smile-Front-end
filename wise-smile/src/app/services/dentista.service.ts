
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// define o serviço como global todas as páginas podem utilizar sem precisar estanciar a classe novamente.
@Injectable({providedIn: 'root'}) 
export class DentistaService {
  
  // Rota DentistaController.java
  private apiUrl = 'http://localhost:8081/dentistas'; 

  constructor(private http: HttpClient) { }

  cadastrar(dentista: any): Observable<any> { // avisa que é uma ação assincrona.
    // pega o token na memória do navegador
    const token = localStorage.getItem('token');
    
    //Anexa o token no cabeçalho (Header) da requisição
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    //  Dispara o POST para o Java levando os dados e a autorização
    return this.http.post(this.apiUrl, dentista, { headers });

    
  }
  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // GET na porta 8081 para puxar todos os dentistas para marcar a consulta
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
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