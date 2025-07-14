import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-configuracion',
  imports: [FormsModule, CommonModule],
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent {
  isDark: boolean = false;
  
  nombre: string = '';
  user: string = '';
  oldPass: string = '';
  newPass: string = '';
  confirmPass: string = '';
  idUsuario: string = '';

  constructor (private login: LoginService, private snackbarService: SnackbarService){}

  onChange() {
    if (this.validarCambioDeDatos()) {
      this.login.actualizarDatos(this.idUsuario, this.nombre, this.user, this.oldPass).subscribe({
        next: (response) => {
          console.log("Datos actualizados con éxito:", response);
          this.snackbarService.show('Datos actualizados correctamente.', 'success');
          this.resetPasswords();
        },
        error: (err) => {
          console.log("Error al actualizar datos:", err);
          this.snackbarService.show('Error inesperado al actualizar los datos.', 'error');
        }
      });
    } else {
      this.snackbarService.show('Por favor, completá todos los campos correctamente.', 'error');
    }
  }
  
  onChangePass() {
    if (this.validarCambioDePassword()) {
      this.login.actualizarDatos(this.idUsuario, this.nombre, this.user, this.oldPass, this.newPass).subscribe(
        (response) => {
          this.login.setUserName(this.nombre);
          this.resetPasswords();
          this.snackbarService.show('Contraseña actualizada con éxito.', 'success');
        },
        (err) => {
          this.snackbarService.show('Error inesperado al actualizar los datos.', 'error');
        }
      );
    } else {
      this.snackbarService.show('Las contraseñas no coincidan o los datos están incompletos.', 'error');
    }
  }
  
  validarCambioDeDatos(): boolean {
    return this.idUsuario != '' && this.nombre.trim() !== '' && this.user.trim() !== '' && this.oldPass.trim() !== '';
  }
  
  validarCambioDePassword(): boolean {
    return (
      this.oldPass.trim() !== '' &&
      this.newPass.trim() !== '' &&
      this.confirmPass.trim() !== '' &&
      this.newPass === this.confirmPass
    );
  }

  ngOnInit(): void {
    // Cargar datos de user
    this.idUsuario = this.login.getUserId();
    this.login.cargarDatos(this.idUsuario).subscribe(
      (response) =>{
        this.nombre = response.nombre;
        this.user = response.user;
      },
      (error) => {
        console.log("Error al cargar datos del usuario.", error);
      }
    )

    // Cargar modo oscuro
    this.isDark = localStorage.getItem('theme') === 'dark';
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const html = document.documentElement;
    if (this.isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  cerrarSession(){
    this.login.logout();
  }
  
  private resetPasswords(){
    this.newPass = '';
    this.oldPass = '';
    this.confirmPass = '';
  }
}
