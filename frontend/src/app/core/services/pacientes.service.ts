import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})

export class PacientesApiService {
  private apiUrl = 'https://sistemamedico.onrender.com/api/pacientes/';

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Listar Pacientes
  getPacientes(page: number, limit: number, search: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Pacientes/?page=${page}&limit=${limit}&search=${search}`, { headers: this.createHeaders() });
  }

  // Obtener Paciente por Id
  getPaciente(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Paciente/${idPaciente}`, { headers: this.createHeaders() });
  }

  // Crear Paciente
  crearPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}Crear`, paciente, { headers: this.createHeaders() });
  }

  // Crear Pacientes
  crearPacientes(pacientes: Paciente[]): Observable<any> {
    return this.http.post(`${this.apiUrl}Crear`, pacientes, { headers: this.createHeaders() });
  }

  // Eliminar Paciente
  eliminarPaciente(idPaciente: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}Eliminar/${idPaciente}`, { headers: this.createHeaders() });  
  }

  // Editar Paciente
  editarPaciente(paciente: Paciente): Observable<any> {
    return this.http.put(`${this.apiUrl}Actualizar`, paciente, { headers: this.createHeaders() });
  }
}