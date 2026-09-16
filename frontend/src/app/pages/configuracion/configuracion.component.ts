import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../core/services/login.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  imports: [FormsModule, CommonModule],
  templateUrl: './configuracion.component.html',
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
  isDark: boolean = false;
  private themeSub?: Subscription;

  nombre: string = '';
  user: string = '';
  oldPass: string = '';
  newPass: string = '';
  confirmPass: string = '';
  _id: string = '';

  guardandoDatos = false;
  guardandoPass = false;

  constructor(
    private login: LoginService,
    private snackbarService: SnackbarService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Cargar datos de user
    this.nombre = this.login.getUserName() || '';
    this.user = this.login.getUser() || '';
    this._id = this.login.getUserId() || '';

    // Sincronizar tema con ThemeService
    this.themeSub = this.themeService.isDark$.subscribe((dark) => {
      this.isDark = dark;
    });
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  obtenerIniciales(nombre?: string): string {
    if (!nombre) return 'DR';
    const partes = nombre.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }

  onChange() {
    if (this.validarCambioDeDatos()) {
      this.guardandoDatos = true;
      this.login.actualizarDatos(this._id, this.nombre, this.user, this.oldPass).subscribe({
        next: (response) => {
          this.login.setUserName(this.nombre);
          this.login.setUser(this.user);
          this.snackbarService.show('Perfil actualizado correctamente.', 'success');
          this.resetPasswords();
          this.guardandoDatos = false;
        },
        error: (err) => {
          this.snackbarService.show(err?.error?.message || 'Error al actualizar el perfil.', 'error');
          this.guardandoDatos = false;
        }
      });
    } else {
      this.snackbarService.show('Por favor, completa todos los campos requeridos.', 'error');
    }
  }

  onChangePass() {
    if (this.validarCambioDePassword()) {
      this.guardandoPass = true;
      this.login.actualizarDatos(this._id, this.nombre, this.user, this.oldPass, this.newPass).subscribe({
        next: (response) => {
          this.resetPasswords();
          this.snackbarService.show('Contraseña actualizada con éxito.', 'success');
          this.guardandoPass = false;
        },
        error: (err) => {
          this.snackbarService.show(err?.error?.message || 'Error al actualizar la contraseña.', 'error');
          this.guardandoPass = false;
        }
      });
    } else {
      this.snackbarService.show('Verifica que las contraseñas coincidan y no estén vacías.', 'error');
    }
  }

  validarCambioDeDatos(): boolean {
    return this._id !== '' && this.nombre.trim() !== '' && this.user.trim() !== '' && this.oldPass.trim() !== '';
  }

  validarCambioDePassword(): boolean {
    return (
      this.oldPass.trim() !== '' &&
      this.newPass.trim() !== '' &&
      this.confirmPass.trim() !== '' &&
      this.newPass === this.confirmPass
    );
  }

  cerrarSession() {
    if (confirm('¿Desea cerrar la sesión actual?')) {
      this.login.logout();
    }
  }

  private resetPasswords() {
    this.newPass = '';
    this.oldPass = '';
    this.confirmPass = '';
  }
}
