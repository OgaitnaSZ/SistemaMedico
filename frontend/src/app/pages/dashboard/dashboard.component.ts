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
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'Completado':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      case 'Cancelado':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 line-through';
      case 'Pendiente':
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    }
  }

  getIniciales(nombre?: string, apellido?: string): string {
    if (!nombre && !apellido) return 'P';
    const n = nombre ? nombre.trim().charAt(0) : '';
    const a = apellido ? apellido.trim().charAt(0) : '';
    return (n + a).toUpperCase() || 'P';
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
