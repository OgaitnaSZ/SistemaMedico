import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:4000/api/usuarios/';

  constructor(private http: HttpClient, private router: Router) {}

  login(user: string, pass: string) {
    return this.http.post<{ token: string ; idUsuario: string ; nombre:string}>(`${this.apiUrl}`, { user, pass });
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
    console.log(nombre);
    localStorage.setItem('nombre', nombre);
  }

  getUserId(): string {
    const id = localStorage.getItem('idUsuario');
    return id ? id:'';
  }

  getUserName(): string {
    const nombre = localStorage.getItem('nombre');
    return nombre !== null ? nombre : 'Doctor';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  cargarDatos(idUsuario: string){
    return this.http.get<{ nombre: string ; user: string }>(`${this.apiUrl}${idUsuario}`);
  }

  actualizarDatos(
    idUsuario: string, nombre: string, user: string, password: string,newPassword?: string // opcional
  ){
    const body: any = { idUsuario, nombre, user, password };
    
    if (newPassword && newPassword.trim() !== '') {
      body.newPassword = newPassword;
    }
  
    return this.http.put<{ message: string }>(`${this.apiUrl}`, body);
  }

}
