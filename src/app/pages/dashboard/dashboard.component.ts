import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopCardComponent } from '../../layout/shared/top-card/top-card.component';
import { ListadoDashboardComponent } from '../../layout/shared/listado-dashboard/listado-dashboard.component';
import { GraficoComponent } from './grafico/grafico.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { LoginService } from '../../core/services/login.service';
import { Dashboard } from '../../core/interfaces/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, TopCardComponent, ListadoDashboardComponent, GraficoComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private dashboardService: DashboardService, private login: LoginService){}

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

  ngOnInit(){
    this.nombre = this.login.getUserName();
    this.cargarEstadisticas();
  }

  cargarEstadisticas(){
    this.dashboardService.getEstadisticas().subscribe(
      (response)=>{
        console.log(response);
        this.dashboard = response;
        this.calcularTotales();
      },
      (error)=>{
        console.log("Error al obtener estadisticas: ", error)
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
