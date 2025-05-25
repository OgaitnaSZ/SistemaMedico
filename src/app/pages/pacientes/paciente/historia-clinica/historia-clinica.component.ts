import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaClinica } from '../../../../core/interfaces/historia-clinica.model';
import { HistoriasClinicasApiService } from '../../../../core/services/historias-clinicas.service';
import { ArchivosAdjuntosComponent } from './archivos-adjuntos/archivos-adjuntos.component';
import { FormConsultaComponent } from "./form-consulta/form-consulta.component";

@Component({
  selector: 'app-historia-clinica',
  imports: [CommonModule, ArchivosAdjuntosComponent, FormConsultaComponent],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent {
  @Input() idPaciente: number | undefined; // ID recibido del componente padre
  mensaje: string = '';
  agregarConsulta: boolean = false;
    
  constructor(private historiaClinicaService: HistoriasClinicasApiService){}
  
  historialClinico: HistoriaClinica[] = [];

  ngOnInit(): void {
    this.cargarHistoriasClinicas();
  }

  actualizarDatos(){
    this.agregarConsulta = false;
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas(){
    if (this.idPaciente !== null && this.idPaciente !== undefined && this.idPaciente > 0) {
      this.historiaClinicaService.getHistoriasClinicas(this.idPaciente).subscribe(
        (data) => {
          this.historialClinico = data;
        },
        (error) => {
          console.error('Error al cargar historia clinica:', error.error);
          this.mensaje = "Este paciente no tiene historia clinica";
        }
      );
    }
  }
}
