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
}