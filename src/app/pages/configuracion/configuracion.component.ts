import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-configuracion',
  imports: [FormsModule, CommonModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  error: string = '';
  success: string = '';
  isDark: boolean = false;
  
  nombre: string = '';
  user: string = '';
  oldPass: string = '';
  newPass: string = '';
  confirmPass: string = '';
  idUsuario: number = 0; // esto deberías cargarlo al iniciar

  constructor (private login: LoginService){}

  onChange() {
    if (this.validarCambioDeDatos()) {
      this.login.actualizarDatos(this.idUsuario, this.nombre, this.user, this.oldPass).subscribe({
        next: (response) => {
          console.log("Datos actualizados con éxito:", response);
          this.success = 'Datos actualizados correctamente.';
          this.resetMensajes();
          this.resetPasswords();
        },
        error: (err) => {
          console.log("Error al actualizar datos:", err);
          this.error = err.error.error || 'Error inesperado al actualizar los datos.';
          this.resetMensajes();
        }
      });
    } else {
      this.error = 'Por favor, completá todos los campos correctamente.';
      this.resetMensajes();
    }
  }
  
  onChangePass() {
    if (this.validarCambioDePassword()) {
      this.login.actualizarDatos(this.idUsuario, this.nombre, this.user, this.oldPass, this.newPass).subscribe({
        next: (response) => {
          console.log("Datos actualizados con éxito:", response);
          this.success = 'Datos actualizados correctamente.';
          this.resetMensajes();
          this.resetPasswords();
        },
        error: (err) => {
          console.log("Error al actualizar datos:", err);
          this.error = err.error?.message || 'Error inesperado al actualizar los datos.';
          this.resetMensajes();
        }
      });
    } else {
      this.error = 'Las contraseñas no coincidan o los datos están incompletos.';
      this.resetMensajes();
    }
  }
  
  validarCambioDeDatos(): boolean {
    return this.idUsuario > 0 && this.nombre.trim() !== '' && this.user.trim() !== '' && this.oldPass.trim() !== '';
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
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const html = document.documentElement;
    if (this.isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
  
  private resetMensajes() {
    setTimeout(() => {
      this.error = '';
      this.success = '';
    }, 3000);
  }

  private resetPasswords(){
    this.newPass = '';
    this.oldPass = '';
    this.confirmPass = '';
  }
}
