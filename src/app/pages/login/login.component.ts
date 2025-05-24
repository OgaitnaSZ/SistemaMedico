import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../core/services/login.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  pass = '';
  error = '';

  constructor(private login: LoginService, private router: Router, private route: ActivatedRoute) {}

  onLogin() {
    this.login.login(this.email, this.pass).subscribe(
      (res) => {
        // Verifica si se recibe el token
        console.log(res);
        if (res.token) {
          this.login.setToken(res.token);  // Guarda el token
          this.router.navigate(['/hospedajes']);  // Redirige al usuario
        } else {
          this.error = 'Token no recibido';
        }
      },
      (err) => {
        // Muestra el error si las credenciales son incorrectas
        this.error = 'Datos incorrectos.'
      }
    );
  }
}
