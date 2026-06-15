
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// define o serviço como global todas as páginas podem utilizar sem precisar estanciar a classe novamente.
@Injectable({providedIn: 'root'}) 
export class DentistaService {
  
  // Rota DentistaController.java
  private apiUrl = 'http://localhost:8081/dentistas'; 

  constructor(private http: HttpClient) { }

  cadastrar(dentista: any): Observable<any> {
    // pega o token na memória do navegador
    const token = localStorage.getItem('token');
    
    //Anexa o token no cabeçalho (Header) da requisição
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    //  Dispara o POST para o Java levando os dados e a autorização
    return this.http.post(this.apiUrl, dentista, { headers });
  }
}