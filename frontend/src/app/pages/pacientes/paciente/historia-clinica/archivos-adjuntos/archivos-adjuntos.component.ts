import { Component, Input } from '@angular/core';
import { ArchivoAdjunto } from '../../../../../core/interfaces/archivo-adjunto.model';
import { ConsultasApiService } from '../../../../../core/services/consultas.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-archivos-adjuntos',
  imports: [],
  templateUrl: './archivos-adjuntos.component.html',
})
export class ArchivosAdjuntosComponent {
  @Input() idConsulta: string | undefined; // ID recibido del componente padre
  verSubir: boolean = false;

  constructor(private consultaService: ConsultasApiService, private snackbarService: SnackbarService){}

  archivoAdjuntos: ArchivoAdjunto[] = [];

  ngOnInit(): void {
    this.cargarArchivos();
  }

  cargarArchivos(){
    if (this.idConsulta !== undefined && this.idConsulta != '') {
      this.consultaService.getArchivosAdjuntos(this.idConsulta).subscribe(
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
    if (this.idConsulta !== undefined && this.idConsulta != '') {
      const formData = new FormData();
      this.archivosSeleccionados.forEach(file => formData.append('archivos[]', file));
      formData.append('idConsulta', this.idConsulta.toString());

      this.consultaService.agregarArchivo(formData).subscribe(
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
      this.consultaService.eliminarArchivo(idArchivo).subscribe(
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
