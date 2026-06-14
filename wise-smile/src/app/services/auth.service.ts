import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'}) // define o serviço como global todas as páginas podem utilizar sem precisar estanciar a classe novamente.

export class AuthService {  // A rota do AutenticacaoController.java
  private apiUrl = 'http://localhost:8081/login';

 
  constructor(private http: HttpClient) { } // Injetando o HttpClient no construtor (faz o que o postman faz, requisição)

  // A função que pega o pacote JSON com o (email e senha) e dispara via POST 'http://localhost:8081/login'
  fazerLogin(credenciais: any): Observable<any> { //Observable<any> faz esperar a resposta da requisição por ela ser assincrona. 
    return this.http.post(this.apiUrl, credenciais);
  }
}