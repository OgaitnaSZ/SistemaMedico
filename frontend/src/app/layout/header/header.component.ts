import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService } from '../../core/services/login.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  tituloSeccion = 'Dashboard';
  subtituloSeccion = 'Resumen clínico y actividad del día';
  nombreDoctor = 'Doctor';
  fechaActual = '';
  isDark = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.nombreDoctor = this.loginService.getUserName() || 'Doctor';
    this.actualizarFecha();
    this.themeService.isDark$.subscribe(dark => this.isDark = dark);

    this.actualizarTituloPorRuta(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.actualizarTituloPorRuta(event.urlAfterRedirects || event.url);
      });
  }

  actualizarFecha(): void {
    const ahora = new Date();
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    this.fechaActual = ahora.toLocaleDateString('es-ES', opciones);
    // Capitalizar primera letra
    this.fechaActual = this.fechaActual.charAt(0).toUpperCase() + this.fechaActual.slice(1);
  }

  actualizarTituloPorRuta(url: string): void {
    if (url.startsWith('/turnos')) {
      this.tituloSeccion = 'Agenda de Turnos';
      this.subtituloSeccion = 'Calendario de citas y programación de pacientes';
    } else if (url.includes('/agregar-paciente')) {
      this.tituloSeccion = 'Registrar Paciente';
      this.subtituloSeccion = 'Alta de nuevo paciente en el sistema';
    } else if (url.includes('/modificar-paciente')) {
      this.tituloSeccion = 'Editar Paciente';
      this.subtituloSeccion = 'Actualización de datos personales y cobertura';
    } else if (url.startsWith('/pacientes/') && url !== '/pacientes') {
      this.tituloSeccion = 'Ficha del Paciente';
      this.subtituloSeccion = 'Historia clínica, consultas previas y documentos';
    } else if (url.startsWith('/pacientes')) {
      this.tituloSeccion = 'Directorio de Pacientes';
      this.subtituloSeccion = 'Búsqueda, historial y registro médico';
    } else if (url.startsWith('/configuracion')) {
      this.tituloSeccion = 'Configuración';
      this.subtituloSeccion = 'Ajustes de cuenta, seguridad y preferencias';
    } else {
      this.tituloSeccion = 'Panel de Control';
      this.subtituloSeccion = 'Resumen clínico y actividad del día';
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getIniciales(nombre: string): string {
    if (!nombre) return 'DR';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  }
}
