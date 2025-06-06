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

  constructor(private login: LoginService, private router: Router, private snackbarService: SnackbarService) {}

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
            this.snackbarService.show('Token no recibido', 'error');
          }
        },
        (err) => {
          // Muestra el error si las credenciales son incorrectas
          this.snackbarService.show('Datos incorrectos.', 'error');
        }
      );
    }else{
      this.snackbarService.show('Faltan datos.', 'error');
    }
  }

  validarDatos(): boolean {
    return (this.user != '' && this.pass != '')
  }

}
