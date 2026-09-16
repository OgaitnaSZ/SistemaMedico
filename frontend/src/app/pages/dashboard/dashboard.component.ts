import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopCardComponent } from '../../layout/shared/top-card/top-card.component';
import { ListadoDashboardComponent } from '../../layout/shared/listado-dashboard/listado-dashboard.component';
import { GraficoComponent } from './grafico/grafico.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { LoginService } from '../../core/services/login.service';
import { Dashboard } from '../../core/interfaces/dashboard.model';
import { SnackbarService } from '../../core/services/snackbar.service';
import { TurnosApiService } from '../../core/services/turnos.service';
import { Turno, EstadoTurno } from '../../core/interfaces/turno.model';
import { Paciente } from '../../core/interfaces/paciente.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, TopCardComponent, ListadoDashboardComponent, GraficoComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(
    private dashboardService: DashboardService,
    private login: LoginService,
    private snackbarService: SnackbarService,
    private turnosService: TurnosApiService
  ){}

  nombre: string = 'Doctor';
  
  dashboard: Dashboard = {
    statsUltimos7Dias: [],
    ultimoPaciente: null,
    ultimas10Consultas: [],
    ultimos10Archivos: []
  };

  totalPacientes: number = 0;
  totalConsultas: number = 0;
  totalArchivos: number = 0;

  proximoTurno: Turno | null = null;
  cargandoProximoTurno: boolean = true;

  ngOnInit(){
    this.nombre = this.login.getUserName();
    this.cargarEstadisticas();
    this.cargarProximoTurno();
  }

  cargarProximoTurno(): void {
    this.cargandoProximoTurno = true;
    this.turnosService.getProximoTurno().subscribe({
      next: (res) => {
        this.proximoTurno = res.turno || null;
        this.cargandoProximoTurno = false;
      },
      error: () => {
        this.cargandoProximoTurno = false;
      }
    });
  }

  getNombrePacienteProximo(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return `${idPaciente.nombre} ${idPaciente.apellido}`;
    }
    return 'Paciente';
  }

  getDniPacienteProximo(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return idPaciente.dni || '';
    }
    return '';
  }

  getIdPacienteProximo(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return idPaciente._id || '';
    }
    return idPaciente || '';
  }

  getClaseEstadoTurno(estado?: EstadoTurno): string {
    switch (estado) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-300 dark:border-green-700';
      case 'Completado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-700';
      case 'Pendiente':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
    }
  }

  cargarEstadisticas(){
    this.dashboardService.getEstadisticas().subscribe(
      (response)=>{
        this.dashboard = response;
        this.calcularTotales();
        console.log(response);
      },
      (error)=>{
        this.snackbarService.show('Error al obtener estadisticas.', 'error');
      }
    )
  }

  calcularTotales(): void {
    const stats = this.dashboard.statsUltimos7Dias;
    this.totalPacientes = this.totalPorMetrica(stats, 'pacientes');
    this.totalConsultas = this.totalPorMetrica(stats, 'consultas');
    this.totalArchivos = this.totalPorMetrica(stats, 'archivos');
  }

  totalPorMetrica(
    stats: { pacientes: number; consultas: number; archivos: number }[],
    metrica: 'pacientes' | 'consultas' | 'archivos'
  ): number {
    return stats.reduce((total, dia) => total + (dia[metrica] || 0), 0);
  }

  calcularEdad(fechaNacimiento?: string | Date): number | null {
    if (!fechaNacimiento) return null;
    const fecha = new Date(fechaNacimiento); // conversion de string a Date
    if (isNaN(fecha.getTime())) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();
  
    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }
  
    return edad;
  }
}
