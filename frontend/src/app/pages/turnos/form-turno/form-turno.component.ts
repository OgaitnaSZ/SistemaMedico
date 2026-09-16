import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Turno, EstadoTurno } from '../../../core/interfaces/turno.model';
import { Paciente } from '../../../core/interfaces/paciente.model';
import { TurnosApiService } from '../../../core/services/turnos.service';
import { PacientesApiService } from '../../../core/services/pacientes.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-form-turno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-turno.component.html',
})
export class FormTurnoComponent implements OnInit {
  @Input() turnoAEditar?: Turno;
  @Input() fechaInicial?: string;
  @Output() onGuardado = new EventEmitter<void>();
  @Output() onCancelado = new EventEmitter<void>();

  modoEdicion = false;
  guardando = false;

  // Campos del formulario
  idPacienteSeleccionado = '';
  pacienteSeleccionado: Paciente | null = null;
  fecha = '';
  hora = '09:00';
  estado: EstadoTurno = 'Pendiente';
  motivo = '';
  notas = '';

  // Búsqueda de pacientes
  terminoBusqueda = '';
  pacientesEncontrados: Paciente[] = [];
  buscandoPacientes = false;
  mostrarResultadosPacientes = false;
  private busquedaSubject = new Subject<string>();

  estados: EstadoTurno[] = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];

  constructor(
    private turnosService: TurnosApiService,
    private pacientesService: PacientesApiService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const hoyStr = new Date().toISOString().split('T')[0];
    this.fecha = this.fechaInicial || hoyStr;

    // Configurar debounce para búsqueda de pacientes
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((termino) => {
      if (termino && termino.trim().length >= 2) {
        this.buscarPacientesApi(termino.trim());
      } else {
        this.pacientesEncontrados = [];
        this.buscandoPacientes = false;
      }
    });

    if (this.turnoAEditar && this.turnoAEditar._id) {
      this.modoEdicion = true;
      this.cargarDatosEdicion(this.turnoAEditar);
    }
  }

  cargarDatosEdicion(turno: Turno): void {
    if (typeof turno.fecha === 'string') {
      this.fecha = turno.fecha.split('T')[0];
    } else if (turno.fecha instanceof Date) {
      this.fecha = turno.fecha.toISOString().split('T')[0];
    }

    this.hora = turno.hora;
    this.estado = turno.estado;
    this.motivo = turno.motivo || '';
    this.notas = turno.notas || '';

    if (typeof turno.idPaciente === 'object' && turno.idPaciente !== null) {
      this.pacienteSeleccionado = turno.idPaciente as Paciente;
      this.idPacienteSeleccionado = (turno.idPaciente as Paciente)._id || '';
    } else if (typeof turno.idPaciente === 'string') {
      this.idPacienteSeleccionado = turno.idPaciente;
      this.pacientesService.getPaciente(this.idPacienteSeleccionado).subscribe({
        next: (paciente: any) => {
          this.pacienteSeleccionado = paciente;
        },
        error: () => {
          // Si no se encuentra el paciente
        }
      });
    }
  }

  onInputBusqueda(valor: string): void {
    this.terminoBusqueda = valor;
    this.buscandoPacientes = true;
    this.mostrarResultadosPacientes = true;
    this.busquedaSubject.next(valor);
  }

  buscarPacientesApi(query: string): void {
    this.pacientesService.getPacientes(1, 10, query).subscribe({
      next: (res: any) => {
        this.pacientesEncontrados = res.data || [];
        this.buscandoPacientes = false;
      },
      error: () => {
        this.buscandoPacientes = false;
      }
    });
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.idPacienteSeleccionado = paciente._id || '';
    this.mostrarResultadosPacientes = false;
    this.terminoBusqueda = '';
  }

  deseleccionarPaciente(): void {
    this.pacienteSeleccionado = null;
    this.idPacienteSeleccionado = '';
  }

  guardar(): void {
    if (!this.idPacienteSeleccionado) {
      this.snackbarService.show('Debe seleccionar un paciente para el turno.', 'error');
      return;
    }

    if (!this.fecha || !this.hora) {
      this.snackbarService.show('Debe indicar la fecha y hora del turno.', 'error');
      return;
    }

    this.guardando = true;

    const payload: Turno = {
      idPaciente: this.idPacienteSeleccionado,
      fecha: this.fecha,
      hora: this.hora,
      estado: this.estado,
      motivo: this.motivo,
      notas: this.notas
    };

    if (this.modoEdicion && this.turnoAEditar?._id) {
      payload._id = this.turnoAEditar._id;
      this.turnosService.editarTurno(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.snackbarService.show('Turno actualizado correctamente.', 'success');
          this.onGuardado.emit();
        },
        error: (err: any) => {
          this.guardando = false;
          const msg = err.error?.error || 'Error al actualizar el turno.';
          this.snackbarService.show(msg, 'error');
        }
      });
    } else {
      this.turnosService.crearTurno(payload).subscribe({
        next: () => {
          this.guardando = false;
          this.snackbarService.show('Turno agendado con éxito.', 'success');
          this.onGuardado.emit();
        },
        error: (err: any) => {
          this.guardando = false;
          const msg = err.error?.error || 'Error al agendar el turno.';
          this.snackbarService.show(msg, 'error');
        }
      });
    }
  }

  cancelar(): void {
    this.onCancelado.emit();
  }
}
