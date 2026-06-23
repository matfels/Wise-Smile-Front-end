import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Rota do back-end (conforme Postman)
  private apiUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) { }

  cadastrar(usuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Dispara o POST para o Java
    return this.http.post(this.apiUrl, usuario, { headers });
  }

  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  deletar(id: number): Observable<any> { // Usado para inativar
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  ativar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}/ativar`, {}, { headers });
  }

  buscarPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  atualizar(id: number, usuario: any): Observable<any> {
    let token = localStorage.getItem('token');
    
    // Trava de segurança: Se o token foi salvo acidentalmente como um objeto JSON, nós extraímos só a string dele
    if (token && token.includes('{"token"')) {
      const tokenObj = JSON.parse(token);
      token = tokenObj.token;
    }

    // O nosso espião: Vai imprimir no F12 exatamente o que está sendo enviado
    console.log("🕵️ TOKEN ENVIADO PARA O JAVA:", token);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Passa o ID para dentro do corpo da requisição (igual fizemos no Postman)
    usuario.id = id;
    
    return this.http.put(this.apiUrl, usuario, { headers });
  }
}

