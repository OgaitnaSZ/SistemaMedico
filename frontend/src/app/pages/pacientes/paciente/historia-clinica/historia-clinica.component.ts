import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Consulta } from '../../../../core/interfaces/consulta.model';
import { ConsultasApiService } from '../../../../core/services/consultas.service';
import { ArchivosComponent } from './archivos-adjuntos/archivos-adjuntos.component';
import { FormConsultaComponent } from './form-consulta/form-consulta.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-historia-clinica',
  imports: [CommonModule, ArchivosComponent, FormConsultaComponent],
  templateUrl: './historia-clinica.component.html',
})
export class HistoriaClinicaComponent {
  @Input() idPaciente: string | undefined; // ID recibido del componente padre
  agregarConsulta: boolean = false;
  idEditando: string | null = null;
    
  constructor(private consultaService: ConsultasApiService, private snackbarService: SnackbarService){}
  
  historialClinico: Consulta[] = [];

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
      this.consultaService.getHistoriasClinicas(this.idPaciente).subscribe(
        (data) => {
          this.historialClinico = data;
          console.log(data);
        },
        (error) => {
          this.snackbarService.show('No hay historia clinica.', 'error');
        }
      );
    }
  }

  eliminarConsulta(idConsulta: string){
    if (confirm(`¿Estás seguro de que deseas eliminar la consulta}?`)) {
      this.consultaService.eliminarConsulta(idConsulta).subscribe(
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
