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

  constructor(private historiaClinicaService: HistoriasClinicasApiService){}

  archivoAdjuntos: ArchivoAdjunto[] = [];

  ngOnInit(): void {
    this.cargarArchivos();
  }

  cargarArchivos(){
    // Cargar historia clinica
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

  eliminarArchivo(idArchivo: number, path: string){
    if (confirm(`¿Estás seguro de que deseas eliminar el archivo ${path}?`)) {
      this.historiaClinicaService.eliminarArchivo(idArchivo).subscribe(
        (response) => {
          this.cargarArchivos();
          console.log('Elimnacion exitosa:', response);
          this.mensaje = 'Elimnacion exitosa.';
        },
        (error) => {
          console.error('Error al eliminar hospedaje:', error);
          this.mensaje = 'Error al eliminar hospedaje.';
        }
      );
    }
  }
}
