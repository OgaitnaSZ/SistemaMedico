import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'localhost/SistemaMedicoUI/api/usuarios/login.php';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, pass: string) {
    return this.http.post<{ token: string ; idUsuario: number ; rol: string}>(this.apiUrl, { email, pass });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
