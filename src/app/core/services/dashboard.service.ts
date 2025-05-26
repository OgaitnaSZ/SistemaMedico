import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dashboard } from '../interfaces/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost/SistemaMedicoUI/api/dashboard.php';
  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<Dashboard> {
    return this.http.post<Dashboard>(this.apiUrl, {});
  }
}
