import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchivoAdjunto } from '../../../../../core/interfaces/archivo-adjunto.model';
import { HistoriasClinicasApiService } from '../../../../../core/services/historias-clinicas.service';

@Component({
  selector: 'app-archivos-adjuntos',
  imports: [CommonModule],
  templateUrl: './archivos-adjuntos.component.html',
  styleUrl: './archivos-adjuntos.component.css'
})
export class ArchivosAdjuntosComponent {
  @Input() idHistoriaClinica: number | undefined; // ID recibido del componente padre
  mensaje: string = '';
  verSubir: boolean = false;

  constructor(private historiaClinicaService: HistoriasClinicasApiService){}

  archivoAdjuntos: ArchivoAdjunto[] = [];

  ngOnInit(): void {
    this.cargarArchivos();
  }

  cargarArchivos(){
    if (this.idHistoriaClinica !== null && this.idHistoriaClinica !== undefined && this.idHistoriaClinica > 0) {
      this.historiaClinicaService.getArchivosAdjuntos(this.idHistoriaClinica).subscribe(
        (data) => {
          this.archivoAdjuntos = data;
        },
        (error) => {
          console.error('Error al cargar archivos adjuntos:', error.error);
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
    if (this.idHistoriaClinica !== null && this.idHistoriaClinica !== undefined && this.idHistoriaClinica > 0) {
      const formData = new FormData();
      this.archivosSeleccionados.forEach(file => formData.append('archivos[]', file));
      formData.append('IdHistoriaClinica', this.idHistoriaClinica.toString());

      this.historiaClinicaService.agregarArchivo(formData).subscribe(
        (data) => {
          console.log("Archivo subido con exito");
        },
        (error) => {
          console.error('Error al agregar archivos adjuntos:', error.error);
          this.mensaje = 'Error al agregar archivos.';
        }
      );
    }
  }

  eliminarArchivo(idArchivo: number, path: string){
    if (confirm(`¿Estás seguro de que deseas eliminar el archivo ${path}?`)) {
      this.historiaClinicaService.eliminarArchivo(idArchivo).subscribe(
        (response) => {
          this.cargarArchivos();
          console.log('Elimnacion exitosa:', response);
          this.mensaje = 'Elimnacion exitosa.';
        },
        (error) => {
          this.mensaje = 'Error al eliminar archivo.';
        }
      );
    }
  }
}
