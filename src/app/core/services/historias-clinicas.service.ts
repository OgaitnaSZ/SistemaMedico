import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../interfaces/historia-clinica.model';

@Injectable({
  providedIn: 'root'
})

export class HistoriasClinicasApiService {
    private apiUrl = 'http://localhost/SistemaMedicoUI/api/historias_clinicas/';
    private apiUrlArchivos = 'localhost/api/archivos_adjuntos/';

  constructor(private http: HttpClient) {}

  // Listar Historias Clinicas de un paciente
  getHistoriasClinicas(idPaciente: number): Observable<any> {
    return this.http.post(`${this.apiUrl}listar-historias-clinicas.php`, { idPaciente: idPaciente });
  }

  // Crear Historia Clinica
  crearHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.apiUrl}crear-historia-clinica.php`, historiaClinica);
  }

  // Editar Historia Clinica
  editarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.post(`${this.apiUrl}editar-historia-clinica.php`, historiaClinica);
  }

  // Eliminar Historia Clinica
  eliminarHistoriaClinica(idHistoriaClinica: number): Observable<any> {
    return this.http.post(`${this.apiUrl}eliminar-historia-clinica.php`, { idHistoriaClinica: idHistoriaClinica });
  }

  /* Archivos Adjuntos */
  /* Obtener Archivos Adjuntos */
  getArchivosAdjuntos(idHistoriaClinica: number): Observable<any> {
    return this.http.get(`${this.apiUrl}cargar-archivos.php?idHistoriaClinica=${idHistoriaClinica}`);
  }
  /* Eliminar Archivo */
  eliminarFoto(idArchivo: number): Observable<any> {
    return this.http.post(`${this.apiUrl}eliminar-archivo.php`, { idArchivo: idArchivo });
  }
  /* Agregar Archivo */
  agregarArchivo(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrl}subir-archivos.php`, formData);
  }

}