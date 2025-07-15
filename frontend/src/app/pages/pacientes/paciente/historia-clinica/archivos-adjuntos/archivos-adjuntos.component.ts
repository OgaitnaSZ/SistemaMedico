import { Component, Input } from '@angular/core';
import { ArchivoAdjunto } from '../../../../../core/interfaces/archivo-adjunto.model';
import { HistoriasClinicasApiService } from '../../../../../core/services/historias-clinicas.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-archivos-adjuntos',
  imports: [],
  templateUrl: './archivos-adjuntos.component.html',
})
export class ArchivosAdjuntosComponent {
  @Input() idHistoriaClinica: string | undefined; // ID recibido del componente padre
  verSubir: boolean = false;

  constructor(private historiaClinicaService: HistoriasClinicasApiService, private snackbarService: SnackbarService){}

  archivoAdjuntos: ArchivoAdjunto[] = [];

  ngOnInit(): void {
    this.cargarArchivos();
  }

  cargarArchivos(){
    if (this.idHistoriaClinica !== undefined && this.idHistoriaClinica != '') {
      this.historiaClinicaService.getArchivosAdjuntos(this.idHistoriaClinica).subscribe(
        (data) => {
          this.archivoAdjuntos = data;
        },
        (error) => {
          this.snackbarService.show('Error al cargar archivos.', 'error');
        }
      );
    }
  }

  // Subir archivo
  archivosSeleccionados: File[] = [];

  onFileSelected(event: any) {
    this.archivosSeleccionados = Array.from(event.target.files);
  }
  
  subirArchivos(event: Event) {
    event.preventDefault();
    if (this.idHistoriaClinica !== undefined && this.idHistoriaClinica != '') {
      const formData = new FormData();
      this.archivosSeleccionados.forEach(file => formData.append('archivos[]', file));
      formData.append('IdHistoriaClinica', this.idHistoriaClinica.toString());

      this.historiaClinicaService.agregarArchivo(formData).subscribe(
        (data) => {
          this.snackbarService.show('Archivos guardados.', 'success');
          this.cargarArchivos();
          this.verSubir = false;
          formData.delete;
        },
        (error) => {
          this.snackbarService.show('Error al guardar archivos.', 'error');
        }
      );
    }
  }

  eliminarArchivo(idArchivo: string, path: string){
    if (confirm(`¿Estás seguro de que deseas eliminar el archivo ${path}?`)) {
      this.historiaClinicaService.eliminarArchivo(idArchivo).subscribe(
        (response) => {
          this.cargarArchivos();
          this.snackbarService.show('Elimnacion exitosa.', 'success');
        },
        (error) => {
          this.snackbarService.show('Error al eliminar archivo.', 'error');
        }
      );
    }
  }
}
