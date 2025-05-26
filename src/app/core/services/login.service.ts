import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost/SistemaMedicoUI/api/usuarios/';

  constructor(private http: HttpClient, private router: Router) {}

  login(user: string, pass: string) {
    return this.http.post<{ token: string ; idUsuario: number}>(`${this.apiUrl}login.php`, { user, pass });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserId(idUsuario: number) {
    localStorage.setItem('idUsuario', idUsuario.toString());
  }

  getUserId(): number {
    const id = localStorage.getItem('idUsuario');
    return id ? parseInt(id, 10):0;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  cargarDatos(idUsuario: number){
    return this.http.post<{ nombre: string ; user: string }>(`${this.apiUrl}cargar-datos.php`, { idUsuario });
  }

  actualizarDatos(
    idUsuario: number, nombre: string, user: string, password: string,newPassword?: string // opcional
  ){
    const body: any = { idUsuario, nombre, user, password };
    
    if (newPassword && newPassword.trim() !== '') {
      body.newPassword = newPassword;
    }
  
    return this.http.post<{ message: string }>(`${this.apiUrl}actualizar-datos.php`, body);
  }

}
