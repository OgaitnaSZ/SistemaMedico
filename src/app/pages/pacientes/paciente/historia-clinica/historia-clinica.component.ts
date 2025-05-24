import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaClinica } from '../../../../core/interfaces/historia-clinica.model';
import { HistoriasClinicasApiService } from '../../../../core/services/historias-clinicas.service';

@Component({
  selector: 'app-historia-clinica',
  imports: [CommonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
    @Input() idPaciente: number | undefined; // ID recibido del componente padre
    mensaje: string = '';
    
    constructor(private historiaClinicaService: HistoriasClinicasApiService){}
    
    historialClinico: HistoriaClinica[] = [];

  ngOnInit(): void {
    // Cargar historia clinica
    if (this.idPaciente !== null && this.idPaciente !== undefined && this.idPaciente > 0) {
      this.historiaClinicaService.getHistoriasClinicas(this.idPaciente).subscribe(
        (data) => {
          console.log(data);
          this.historialClinico = data;
        },
        (error) => {
          console.error('Error al cargar historia clinica:', error.error);
          this.mensaje = "Historia clinica no encontrada";
        }
      );
    }
  }

}
