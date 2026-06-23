import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  // Endpoint configurado no Controller do Java
  // Esta é a URL (endereço) onde o nosso Back-end está escutando os pedidos sobre consultas.
  private apiUrl = 'http://localhost:8081/consultas';

  // O construtor "injeta" o HttpClient, que é a ferramenta do Angular usada para fazer requisições de rede (GET, POST, etc).
  constructor(private http: HttpClient) { }

  // Método para salvar um novo agendamento no banco de dados
  cadastrar(agendamento: any): Observable<any>  {
    // 1. Vai no "cofre" do navegador (localStorage) e pega a chave de acesso (Token JWT) salva no Login.
    const token = localStorage.getItem('token' );
    
    // 2. Prepara o "envelope" da requisição (headers), carimbando com a nossa chave de autorização.
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // 3. Dispara a requisição POST enviando os dados da consulta e o cabeçalho de segurança.
    return this.http.post(this.apiUrl, agendamento, { headers });
  }

  // Método que busca a lista de todas as consultas cadastradas
  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // O GET pede os dados. O '<any[]>' avisa o Angular que a resposta será uma lista (array) de várias coisas.
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Método que avisa o Back-end para cancelar uma consulta específica
  cancelarConsulta(id: number, motivo: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // O HttpParams é usado para grudar parâmetros na URL (ex: /cancelar?motivo=paciente desistiu)
    const parametros = new HttpParams().set('motivo', motivo);
    
    // Dispara um PUT para a rota de cancelamento do Java. 
    // O "null" ali no meio significa que não tem corpo na requisição, só a URL e os cabeçalhos.
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, null, { headers: headers, params: parametros });
  }
}