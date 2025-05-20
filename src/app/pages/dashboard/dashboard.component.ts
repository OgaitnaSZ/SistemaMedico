import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paciente } from '../../core/interfaces/paciente.model';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, CommonModule, BaseChartDirective, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

   chartOptions: ChartOptions = {
      responsive: true,
      plugins: { legend: { display: false } },
    };
  
  chartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Historias Clínicas',
        data: [5, 8, 6, 10, 7, 9, 12],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        type: 'line'
      },
    ],
  };

  fechaTest: Date = new Date();
  ultimoPaciente: Paciente = {
    idPaciente:  0,
    nombre: 'Maria',
    apellido: 'Gomez',
    genero: 'Mujer',
    dni: '123',
    fechaNacimiento: this.fechaTest,
    telefono: '123',
    email: 'maria@gmail.com',
    direccion: 'Av. Roca 1200',
    created_at: this.fechaTest,
  };

  pacientes = Array.from({ length: 10 }).map((_, i) => ({
    nombre: `Paciente ${i + 1}`,
    fecha: `2025-05-${20 - i}`,
  }));

  archivos = Array.from({ length: 10 }).map((_, i) => ({
    nombre: `archivo_${i + 1}.pdf`,
    fecha: `2025-05-${20 - i}`,
  }));
}
