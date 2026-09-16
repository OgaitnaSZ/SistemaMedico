import { Component } from '@angular/core';
import { LoginService } from '../../core/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user = '';
  pass = '';
  cargando = false;
  mostrarPassword = false;

  constructor(private login: LoginService, private router: Router, private snackbarService: SnackbarService) {}

  onLogin() {
    if (this.validarDatos()) {
      this.cargando = true;
      this.login.login(this.user, this.pass).subscribe(
        (res) => {
          this.cargando = false;
          if (res?.data?.token) {
            this.login.setToken(res.data.token);
            this.login.setUserId(res.data.user._id);
            this.login.setUser(res.data.user.usuario);
            this.login.setUserName(res.data.user.nombre);
            this.router.navigate(['/dashboard']);
          } else {
            this.snackbarService.show('Token no recibido', 'error');
          }
        },
        (err) => {
          this.cargando = false;
          this.snackbarService.show(err?.error?.message || 'Usuario o contraseña incorrectos.', 'error');
        }
      );
    } else {
      this.snackbarService.show('Por favor ingrese usuario y contraseña.', 'error');
    }
  }

  validarDatos(): boolean {
    return this.user.trim() !== '' && this.pass.trim() !== '';
  }
}
