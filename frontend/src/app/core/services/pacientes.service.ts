import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})

export class PacientesApiService {
  private apiUrl = 'http://localhost:4000/api/pacientes/';

  constructor(private http: HttpClient) {}

  // Listar Pacientes
  getPacientes(page: number, limit: number, search: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Pacientes/?page=${page}&limit=${limit}&search=${search}`);
  }

  // Obtener Paciente por Id
  getPaciente(idPaciente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Paciente/${idPaciente}`);
  }

  // Crear Paciente
  crearPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}Crear`, paciente);
  }

  // Crear Pacientes
  crearPacientes(pacientes: Paciente[]): Observable<any> {
    return this.http.post(`${this.apiUrl}Crear`, pacientes);
  }

  // Eliminar Paciente
  eliminarPaciente(idPaciente: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}Eliminar/${idPaciente}`);  
  }

  // Editar Paciente
  editarPaciente(paciente: Paciente): Observable<any> {
    return this.http.put(`${this.apiUrl}Actualizar`, paciente);
  }
}