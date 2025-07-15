import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriaClinica } from '../../../../core/interfaces/historia-clinica.model';
import { HistoriasClinicasApiService } from '../../../../core/services/historias-clinicas.service';
import { ArchivosAdjuntosComponent } from './archivos-adjuntos/archivos-adjuntos.component';
import { FormConsultaComponent } from "./form-consulta/form-consulta.component";
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-historia-clinica',
  imports: [CommonModule, ArchivosAdjuntosComponent, FormConsultaComponent],
  templateUrl: './historia-clinica.component.html',
})
export class HistoriaClinicaComponent {
  @Input() idPaciente: string | undefined; // ID recibido del componente padre
  agregarConsulta: boolean = false;
  idEditando: string | null = null;
    
  constructor(private historiaClinicaService: HistoriasClinicasApiService, private snackbarService: SnackbarService){}
  
  historialClinico: HistoriaClinica[] = [];

  ngOnInit(): void {
    this.cargarHistoriasClinicas();
  }

  actualizarDatos(){
    this.agregarConsulta = false;
    this.idEditando = '';
    this.cargarHistoriasClinicas();
  }

  cargarHistoriasClinicas(){
    if (this.idPaciente !== undefined && this.idPaciente != '') {
      this.historiaClinicaService.getHistoriasClinicas(this.idPaciente).subscribe(
        (data) => {
          this.historialClinico = data;
        },
        (error) => {
          this.snackbarService.show('No hay historia clinica.', 'error');
        }
      );
    }
  }

  eliminarConsulta(idHistoriaClinica: string){
    if (confirm(`¿Estás seguro de que deseas eliminar la consulta}?`)) {
      this.historiaClinicaService.eliminarHistoriaClinica(idHistoriaClinica).subscribe(
        (response) => {
          this.snackbarService.show('Eliminación exitosa.', 'success');
          this.cargarHistoriasClinicas();
        },
        (error) => {
          this.snackbarService.show('Error al eliminar consulta.', 'error');
        }
      );
    }
  }
}
