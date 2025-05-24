import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../interfaces/paciente.model';

@Injectable({
  providedIn: 'root'
})

export class PacientesApiService {
    private apiUrl = 'localhost/SistemaMedicoUI/api/pacientes';

  constructor(private http: HttpClient) {}

  // Listar Pacientes
  getPacientes(parametros: string): Observable<any> {
    if (parametros != '' && parametros != null && parametros != undefined){
      return this.http.get(`${this.apiUrl}listar-pacientes.php?parametros=${parametros}`);
    }else{
      return this.http.get(`${this.apiUrl}listar-pacientes.php`);
    }
  }

  // Obtener Paciente por Id
  getPaciente(idPaciente: number): Observable<any> {
    return this.http.get(`${this.apiUrl}listar-paciente.php?idPaciente=${idPaciente}`);
  }

  // Crear Paciente
  crearPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}crear-paciente.php`, paciente);
  }

  // Eliminar Hospedaje
  eliminarPaciente(idPaciente: number): Observable<any> {
    return this.http.post(`${this.apiUrl}eliminar-paciente.php`, { idPaciente: idPaciente });
  }

  // Editar Hospedaje
  editarPaciente(paciente: Paciente): Observable<any> {
    return this.http.post(`${this.apiUrl}editar-paciente.php`, paciente);
  }
}