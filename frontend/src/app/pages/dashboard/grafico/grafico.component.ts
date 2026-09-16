import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { DiaEstadisticaConDia } from '../../../core/interfaces/dashboard.model';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './grafico.component.html',
})
export class GraficoComponent {
  @Input() estadisticas: DiaEstadisticaConDia[] = []; 
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  opciones = [
    { id: 'consultas', label: 'Consultas', icon: 'stethoscope' },
    { id: 'pacientes', label: 'Pacientes', icon: 'person_add' },
    { id: 'archivos', label: 'Archivos', icon: 'description' }
  ];
  tipoSeleccionado: string = 'consultas';

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: {
          stepSize: 1,
          font: { family: 'Inter', size: 11 },
          color: '#64748b'
        },
        suggestedMax: 6
      },
    },
  };
  
  chartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Consultas',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
        type: 'line'
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadisticas'] && this.estadisticas) {
      this.actualizarDatosDelGrafico();
    }
  }

  seleccionarTipo(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.actualizarDatosDelGrafico();
  }

  actualizarDatosDelGrafico(): void {
    const labels = this.estadisticas.map(d => {
      // Capitalizar día de la semana
      const dStr = d.dia || '';
      return dStr.charAt(0).toUpperCase() + dStr.slice(1, 3);
    });
  
    const pacientesData = this.estadisticas.map(d => d.pacientes || 0);
    const consultasData = this.estadisticas.map(d => d.consultas || 0);
    const archivosData = this.estadisticas.map(d => d.archivos || 0);
  
    let datosSeleccionados: number[];
    let colorBorde = '#2563eb';
    let colorFondo = 'rgba(37, 99, 235, 0.08)';

    switch (this.tipoSeleccionado) {
      case 'pacientes':
        datosSeleccionados = pacientesData;
        colorBorde = '#059669';
        colorFondo = 'rgba(5, 150, 105, 0.08)';
        break;
      case 'archivos':
        datosSeleccionados = archivosData;
        colorBorde = '#7c3aed';
        colorFondo = 'rgba(124, 58, 237, 0.08)';
        break;
      case 'consultas':
      default:
        datosSeleccionados = consultasData;
        colorBorde = '#2563eb';
        colorFondo = 'rgba(37, 99, 235, 0.08)';
    }
  
    const ds = this.chartData.datasets[0];
    ds.label = this.obtenerEtiqueta(this.tipoSeleccionado);
    ds.data = datosSeleccionados;
    ds.borderColor = colorBorde;
    ds.backgroundColor = colorFondo;
    ds.pointBackgroundColor = colorBorde;
    this.chartData.labels = labels;
    this.chart?.update();
  }

  obtenerEtiqueta(tipo: string): string {
    switch (tipo) {
      case 'consultas': return 'Consultas Médicas';
      case 'archivos': return 'Archivos Clínicos';
      case 'pacientes': return 'Nuevos Pacientes';
      default: return 'Datos';
    }
  }
}
