import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consulta } from '../interfaces/consulta.model';

@Injectable({
  providedIn: 'root'
})

export class ConsultasApiService {
    private apiUrl = 'http://localhost:4000/api/consultas/';
    private apiUrlArchivos = 'http://localhost:4000/api/archivos/';

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Listar Historias Clinicas de un paciente
  getHistoriasClinicas(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Paciente/${idPaciente}`, { headers: this.createHeaders() });
  }

  // Crear Cibsykta
  crearConsulta(consulta: Consulta): Observable<any> {
    if (consulta._id === '' || consulta._id === null || consulta._id === undefined) {
      delete consulta._id;  // Elimina la propiedad '_id' si es nueva consulta
    }
    return this.http.post(`${this.apiUrl}Crear`, consulta, { headers: this.createHeaders() });
  }


  // Editar Historia Clinica
  editarConsulta(consulta: Consulta): Observable<any> {
    return this.http.put(`${this.apiUrl}Actualizar`, consulta, { headers: this.createHeaders() });
  }

  // Eliminar Historia Clinica
  eliminarConsulta(idConsulta: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}Eliminar/${idConsulta}`, { headers: this.createHeaders() });
  };

  /* Archivos */
  /* Obtener Archivos */
  getArchivos(idConsulta: string): Observable<any> {
    return this.http.get(`${this.apiUrlArchivos}Consulta/${idConsulta}`, { headers: this.createHeaders() });
  }

  /* Eliminar Archivo */
  eliminarArchivo(idArchivo: string): Observable<any> {
    return this.http.delete(`${this.apiUrlArchivos}Eliminar/${idArchivo}`, { headers: this.createHeaders() });
  }

  /* Agregar Archivo */
  agregarArchivo(formData: FormData): Observable<any>{
    return this.http.post(`${this.apiUrlArchivos}Subir`, formData, { headers: this.createHeaders() });
  }

}