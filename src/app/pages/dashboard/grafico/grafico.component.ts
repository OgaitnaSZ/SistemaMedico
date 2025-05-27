import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-grafico',
  imports: [BaseChartDirective, BaseChartDirective, CommonModule, FormsModule],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.css'
})
export class GraficoComponent {
  @Input() estadisticas: any; 
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  opciones = ['consultas', 'archivos', 'pacientes'];
  tipoSeleccionado: string = 'consultas'; // default

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estadisticas'] && this.estadisticas) {
      this.actualizarDatosDelGrafico();
    }
  }

  onTipoChange(): void {
    this.actualizarDatosDelGrafico();
  }

  actualizarDatosDelGrafico(): void {
    const diasOrdenados = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

    const datos = diasOrdenados.map(dia => {
      const stat = this.estadisticas[dia];
      return stat ? stat[this.tipoSeleccionado] ?? 0 : 0;
    });

    this.chartData.datasets[0].label = this.obtenerEtiqueta(this.tipoSeleccionado);
    this.chartData.datasets[0].data = datos;
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
