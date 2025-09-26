import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://sistemamedico.onrender.com/api/usuarios/';

  // Crear los encabezados con el Bearer Token
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`, // Obtener token
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private router: Router) {}

  login(user: string, pass: string) {
    return this.http.post<{ data: any }>(`${this.apiUrl}login`, { usuario: user, password: pass });
  }

  actualizarDatos(
    _id: string, nombre: string, usuario: string, password: string,newPassword?: string // opcional
  ){
    const body: any = { _id, nombre, usuario, password };
    
    if (newPassword && newPassword.trim() !== '') {
      body.newPassword = newPassword;
    }

    this.setUser(usuario);
    this.setUserName(nombre);
  
    return this.http.put<{ message: string }>(`${this.apiUrl}actualizar`, body, { headers: this.createHeaders() });
  }

  private createHeaders(): HttpHeaders {
      const token = this.getToken();
      return new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserId(idUsuario: string) {
    localStorage.setItem('idUsuario', idUsuario);
  }
  setUserName(nombre: string) {
    localStorage.setItem('nombre', nombre);
  }
  setUser(usuario: string){
    localStorage.setItem('usuario', usuario);
  }

  getUserId(): string {
    const id = localStorage.getItem('idUsuario');
    return id ? id:'';
  }
  getUserName(): string {
    const nombre = localStorage.getItem('nombre');
    return nombre !== null ? nombre : 'Doctor';
  }
  getUser(): string {
    const usuario = localStorage.getItem('usuario');
    return usuario !== null ? usuario : '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
