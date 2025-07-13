import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})

export class PacientesApiService {
    private apiUrl = 'http://localhost/SistemaMedicoUI/api/pacientes.php';

  constructor(private http: HttpClient) {}

  // Listar Pacientes
  getPacientes(page: number, limit: number, search: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`);
  }

  // Obtener Paciente por Id
  getPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?idPaciente=${idPaciente}`);
  }

  // Crear Paciente
  crearPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}`, paciente);
  }

  // Crear Pacientes
  crearPacientes(pacientes: Paciente[]): Observable<any> {
    return this.http.post(`${this.apiUrl}`, pacientes);
  }


  // Eliminar Paciente
  eliminarPaciente(idPaciente: number): Observable<any> {
    return this.http.request('delete', this.apiUrl, {
      body: { idPaciente }
    });
  }


  // Editar Paciente
  editarPaciente(paciente: Paciente): Observable<any> {
    return this.http.put(this.apiUrl, paciente);
  }
}