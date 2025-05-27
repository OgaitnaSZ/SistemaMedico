import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../core/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user = '';
  pass = '';
  error = '';

  constructor(private login: LoginService, private router: Router) {}

  onLogin() {
    if(this.validarDatos()){
      this.login.login(this.user, this.pass).subscribe(
        (res) => {
          if (res.token) {
            this.login.setToken(res.token);  // Guarda el token
            this.login.setUserId(res.idUsuario);  // Guardar ID de usuario
            this.login.setUserName(res.nombre);  // Guardar nombre de usuario
            this.router.navigate(['/dashboard']);  // Redirige al usuario
          } else {
            this.error = 'Token no recibido';
          }
        },
        (err) => {
          // Muestra el error si las credenciales son incorrectas
          this.error = err.error?.message || 'Error inesperado';
        }
      );
    }else{
      this.error = 'Faltan datos.';
        setTimeout(() => {
          this.error = '';
        }, 3000);
    }
  }

  validarDatos(): boolean {
    return (this.user != '' && this.pass != '')
  }

}
