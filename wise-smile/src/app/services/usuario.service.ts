import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Essa é a rota principal para lidar com usuários no nosso back-end.
  private apiUrl = 'http://localhost:8081/usuarios';

  // Injetamos o HttpClient para poder fazer as chamadas de rede.
  constructor(private http: HttpClient) { }

  // Cadastra um novo usuário no sistema.
  cadastrar(usuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Dispara uma requisição POST. O corpo da requisição é a variável 'usuario'.
    return this.http.post(this.apiUrl, usuario, { headers });
  }

  // Traz a lista completa de usuários do back-end.
  listar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // GET clássico. O '<any[]>' indica que a resposta esperada é uma lista (array).
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Método para excluir ou inativar um usuário pelo seu ID.
  deletar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // O método DELETE anexa o ID do usuário direto na URL (ex: /usuarios/5).
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para reativar um usuário que estava inativo.
  ativar(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Faz um PUT na rota específica de ativação (ex: /usuarios/5/ativar).
    // O `{}` vazio no meio significa que não precisamos enviar dados no corpo da requisição, apenas na URL.
    return this.http.put(`${this.apiUrl}/${id}/ativar`, {}, { headers });
  }

  // Busca as informações detalhadas de um único usuário usando o ID dele.
  buscarPorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // GET passando o ID na URL (ex: /usuarios/3)
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  // Atualiza as informações de um usuário existente.
  atualizar(id: number, usuario: any): Observable<any> {
    let token = localStorage.getItem('token');
    
    // 💡 Essa trava é sensacional: Às vezes salvamos o token inteiro como JSON sem querer ("{"token": "xyz"}").
    // Esse if "pesca" a palavra correta do token caso isso tenha acontecido, evitando erro de Autorização!
    if (token && token.includes('{"token"')) {
      const tokenObj = JSON.parse(token);
      token = tokenObj.token;
    }

    // Console log de debug, muito útil para vermos no F12 (DevTools) se a extração acima deu certo.
    console.log("🕵️ TOKEN ENVIADO PARA O JAVA:", token);

    // Monta o cabeçalho final.
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Pega o 'id' que veio nos parâmetros da função e "injeta" dentro do objeto usuário.
    // Isso garante que o back-end saiba exatamente qual registro alterar.
    usuario.id = id;
    
    // Dispara um PUT geral para a rota de usuários, enviando o objeto modificado.
    return this.http.put(this.apiUrl, usuario, { headers });
  }
}
