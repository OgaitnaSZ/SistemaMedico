import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoriaClinica } from '../interfaces/historia-clinica.model';

@Injectable({
  providedIn: 'root'
})

export class HistoriasClinicasApiService {
    //private apiUrl = 'http://localhost/SistemaMedicoUI/api/historias_clinicas.php'; (PHP)
    private apiUrlArchivos = 'http://localhost/SistemaMedicoUI/api/archivos_adjuntos.php';
    private apiUrl = 'http://localhost:4000/api/historiaClinica/';

  constructor(private http: HttpClient) {}

  // Listar Historias Clinicas de un paciente
  getHistoriasClinicas(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${idPaciente}`);
  }

  // Crear Historia Clinica
  crearHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    console.log(historiaClinica);
    return this.http.post(`${this.apiUrl}`, historiaClinica);
  }

  // Editar Historia Clinica
  editarHistoriaClinica(historiaClinica: HistoriaClinica): Observable<any> {
    return this.http.put(`${this.apiUrl}`, historiaClinica);
  }

  // Eliminar Historia Clinica
  eliminarHistoriaClinica(idHistoriaClinica: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${idHistoriaClinica}`);
  };

  /* Archivos Adjuntos */
  /* Obtener Archivos Adjuntos */
  getArchivosAdjuntos(idHistoriaClinica: string): Observable<any> {
    return this.http.get(`${this.apiUrlArchivos}?idHistoriaClinica=${idHistoriaClinica}`);
  }
  /* Eliminar Archivo */
  eliminarArchivo(idArchivo: string): Observable<any> {
    return this.http.request('delete' ,this.apiUrlArchivos, {
      body: { idArchivo }
    });
  }
  /* Agregar Archivo */
  agregarArchivo(formData: FormData): Observable<any>{
    console.log(formData.keys);
    return this.http.post(`${this.apiUrlArchivos}`, formData);
  }

}