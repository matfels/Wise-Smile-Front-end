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


  //  método para buscar um único paciente pelo ID (usado na edição)
  buscarPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  //método  atualizar os dados do paciente 
  atualizar(id: number, paciente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, paciente, { headers });
  
  
  }
}