import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})

export class PacientesApiService {
    private apiUrl = 'http://localhost/SistemaMedicoUI/api/pacientes/';

  constructor(private http: HttpClient) {}

  // Listar Pacientes
  getPacientes(page: number, limit: number, search: string): Observable<any> {
    return this.http.get(`${this.apiUrl}listar-pacientes.php?page=${page}&limit=${limit}&search=${search}`);
  }

  // Obtener Paciente por Id
  getPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}listar-paciente.php?idPaciente=${idPaciente}`);
  }

  // Crear Paciente
  crearPaciente(paciente: Paciente): Observable<any> {
    console.log(paciente);
    return this.http.post(`${this.apiUrl}crear-paciente.php`, paciente);
  }

  // Eliminar Paciente
  eliminarPaciente(idPaciente: number): Observable<any> {
    return this.http.post(`${this.apiUrl}eliminar-paciente.php`, { idPaciente: idPaciente });
  }

  // Editar Paciente
  editarPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}editar-paciente.php`, paciente);
  }
}