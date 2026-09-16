import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from '../interfaces/turno.model';

@Injectable({
  providedIn: 'root'
})
export class TurnosApiService {
  private apiUrl = 'http://localhost:4000/api/turnos/';

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Listar turnos con filtros opcionales
  getTurnos(filtros?: { fecha?: string; fechaInicio?: string; fechaFin?: string; mes?: number; anio?: number; idPaciente?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.fecha) params = params.set('fecha', filtros.fecha);
      if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);
      if (filtros.mes !== undefined) params = params.set('mes', filtros.mes.toString());
      if (filtros.anio !== undefined) params = params.set('anio', filtros.anio.toString());
      if (filtros.idPaciente) params = params.set('idPaciente', filtros.idPaciente);
    }
    return this.http.get(`${this.apiUrl}Turnos`, { headers: this.createHeaders(), params });
  }

  // Obtener próximo turno activo del doctor
  getProximoTurno(): Observable<any> {
    return this.http.get(`${this.apiUrl}Proximo`, { headers: this.createHeaders() });
  }

  // Obtener turno por ID
  getTurno(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}Turno/${id}`, { headers: this.createHeaders() });
  }

  // Crear turno
  crearTurno(turno: Turno): Observable<any> {
    const turnoPayload = { ...turno };
    if (!turnoPayload._id) {
      delete turnoPayload._id;
    }
    return this.http.post(`${this.apiUrl}Crear`, turnoPayload, { headers: this.createHeaders() });
  }

  // Editar turno
  editarTurno(turno: Turno): Observable<any> {
    return this.http.put(`${this.apiUrl}Actualizar`, turno, { headers: this.createHeaders() });
  }

  // Cancelar turno
  cancelarTurno(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}Cancelar/${id}`, {}, { headers: this.createHeaders() });
  }

  // Eliminar turno
  eliminarTurno(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}Eliminar/${id}`, { headers: this.createHeaders() });
  }
}
