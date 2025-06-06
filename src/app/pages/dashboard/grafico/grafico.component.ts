import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { DiaEstadisticaConDia } from '../../../core/interfaces/dashboard.model';

@Component({
  selector: 'app-grafico',
  imports: [BaseChartDirective, BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './grafico.component.html',
})
export class GraficoComponent {
  @Input() estadisticas: DiaEstadisticaConDia[] = []; 
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  opciones = ['consultas', 'archivos', 'pacientes'];
  tipoSeleccionado: string = 'consultas'; // default

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true, // Siempre empieza en 0
        ticks: {
          stepSize: 1 // Va de uno en uno
        },
        suggestedMax: 10 // Opcional: fuerza un máximo sugerido
      },
    },
  };
  
  chartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Historias Clínicas',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
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

  onTipoChange(): void {
    this.actualizarDatosDelGrafico();
  }

  actualizarDatosDelGrafico(): void {
    const labels = this.estadisticas.map(d => d.dia);
  
    const pacientesData = this.estadisticas.map(d => d.pacientes);
    const consultasData = this.estadisticas.map(d => d.consultas);
    const archivosData = this.estadisticas.map(d => d.archivos);
  
    // Datos segun tipo seleccionado
    let datosSeleccionados: number[];
    switch (this.tipoSeleccionado) {
      case 'pacientes':
        datosSeleccionados = pacientesData;
        break;
      case 'consultas':
        datosSeleccionados = consultasData;
        break;
      case 'archivos':
        datosSeleccionados = archivosData;
        break;
      default:
        datosSeleccionados = []; 
    }
  
    this.chartData.datasets[0].label = this.obtenerEtiqueta(this.tipoSeleccionado);
    this.chartData.datasets[0].data = datosSeleccionados;
    this.chartData.labels = labels;
    this.chart?.update();
  }

  obtenerEtiqueta(tipo: string): string {
    switch (tipo) {
      case 'consultas': return 'Historias Clínicas';
      case 'archivos': return 'Archivos';
      case 'pacientes': return 'Pacientes';
      default: return 'Datos';
    }
  }
}
