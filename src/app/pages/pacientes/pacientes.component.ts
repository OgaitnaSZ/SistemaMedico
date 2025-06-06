import { Component } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Paciente } from '../../core/interfaces/paciente.model';
import { PacientesApiService } from '../../core/services/pacientes.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-pacientes',
  imports: [FormsModule, InfiniteScrollDirective, RouterLink],
  templateUrl: './pacientes.component.html',
})
export class PacientesComponent {
  pacientes: Paciente[] = [];
  hayPacientes = false;
  cargando = false;
  finalDeLista = false;
  terminoBusqueda = '';
  pagina = 1;
  limite = 20;

  private busquedaSubject = new Subject<string>();

  constructor(private pacientesService: PacientesApiService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    // Escuchamos los cambios en la búsqueda con debounce
    this.busquedaSubject.pipe(debounceTime(400)).subscribe((valor) => {
      this.pagina = 1;
      this.pacientes = [];
      this.finalDeLista = false;
      this.cargarPacientes();
    });

    this.cargarPacientes(); // Carga inicial
  }

  buscarPacientes() {
    this.busquedaSubject.next(this.terminoBusqueda);
  }

  cargarPacientes(){
    if (this.cargando || this.finalDeLista) return;

    this.cargando = true;

    this.pacientesService.getPacientes(this.pagina, this.limite, this.terminoBusqueda || '').subscribe(
      (response) => {
        // response.data es el array de pacientes
        if (!response.data || response.data.length === 0) {
          this.finalDeLista = true;
        } else {
          // Agregar los pacientes al array existente
          this.pacientes.push(...response.data);  // spread para agregar múltiples elementos
          this.pagina++;
        }
        this.cargando = false;
      },
      (error) => {
        this.snackbarService.show(error.error.message, 'error');
        this.cargando = false;
      }
    );
  }

  calcularEdad(fechaNacimiento?: string | Date): number | null {
    if (!fechaNacimiento) return null;
    const fecha = new Date(fechaNacimiento); // conversion de string a Date
    if (isNaN(fecha.getTime())) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    const dia = hoy.getDate() - fecha.getDate();
  
    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }
  
    return edad;
  }
}
