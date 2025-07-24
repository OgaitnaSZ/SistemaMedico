import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../interfaces/consulta.model';

@Injectable({
  providedIn: 'root'
})

export class ConsultasApiService {
    private apiUrl = 'http://localhost:4000/api/consultas/';
    private apiUrlArchivos = 'http://localhost:4000/api/archivo/';

  constructor(private http: HttpClient) {}

  // Listar Historias Clinicas de un paciente
  getHistoriasClinicas(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${idPaciente}`);
  }

  // Crear Historia Clinica
  crearConsulta(consulta: Consulta): Observable<any> {
    console.log(consulta);
    return this.http.post(`${this.apiUrl}`, consulta);
  }

  // Editar Historia Clinica
  editarConsulta(consulta: Consulta): Observable<any> {
    return this.http.put(`${this.apiUrl}`, consulta);
  }

  // Eliminar Historia Clinica
  eliminarConsulta(idConsulta: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${idConsulta}`);
  };

  /* Archivos */
  /* Obtener Archivos */
  getArchivos(idConsulta: string): Observable<any> {
    return this.http.get(`${this.apiUrlArchivos}${idConsulta}`);
  }

  /* Eliminar Archivo */
  eliminarArchivo(idArchivo: string): Observable<any> {
    return this.http.delete(`${this.apiUrlArchivos}${idArchivo}`);
  }

  /* Agregar Archivo */
  agregarArchivo(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrlArchivos}`, formData);
  }

}