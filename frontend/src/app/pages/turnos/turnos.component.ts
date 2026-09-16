import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TurnosApiService } from '../../core/services/turnos.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { Turno, EstadoTurno } from '../../core/interfaces/turno.model';
import { Paciente } from '../../core/interfaces/paciente.model';
import { FormTurnoComponent } from './form-turno/form-turno.component';

interface DiaCalendario {
  fecha: Date;
  fechaStr: string; // 'YYYY-MM-DD'
  numero: number;
  esMesActual: boolean;
  esHoy: boolean;
  esSeleccionado: boolean;
  turnos: Turno[];
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormTurnoComponent],
  templateUrl: './turnos.component.html',
})
export class TurnosComponent implements OnInit {
  // Fecha visualizada en el calendario
  fechaCalendario = new Date();
  mesActual = 0;
  anioActual = 2026;

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  cuadriculaDias: DiaCalendario[] = [];
  turnosDelMes: Turno[] = [];
  cargando = false;

  // Día seleccionado
  diaSeleccionadoStr = '';
  turnosDelDiaSeleccionado: Turno[] = [];

  // Filtro de estado
  filtroEstado: string = 'Todos';

  // Modales
  mostrarModalForm = false;
  mostrarModalDetalle = false;
  turnoAEditar?: Turno;
  turnoSeleccionado: Turno | null = null;
  fechaInicialParaNuevoTurno = '';

  constructor(
    private turnosService: TurnosApiService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
    this.diaSeleccionadoStr = this.formatearFechaLocal(hoy);

    this.cargarTurnos();
  }

  formatearFechaLocal(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  cargarTurnos(): void {
    this.cargando = true;

    this.turnosService.getTurnos({
      mes: this.mesActual + 1,
      anio: this.anioActual
    }).subscribe({
      next: (res: any) => {
        this.turnosDelMes = res.turnos || [];
        this.generarCalendario();
        this.actualizarTurnosDiaSeleccionado();
        this.cargando = false;
      },
      error: () => {
        this.snackbarService.show('Error al cargar los turnos.', 'error');
        this.cargando = false;
      }
    });
  }

  generarCalendario(): void {
    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);

    // Día de la semana del primer día (0=Dom, 1=Lun, ..., 6=Sáb)
    // Convertir a lunes = 0, ..., domingo = 6
    let diaInicio = primerDiaMes.getDay() - 1;
    if (diaInicio === -1) diaInicio = 6;

    const totalDiasMes = ultimoDiaMes.getDate();
    const hoyStr = this.formatearFechaLocal(new Date());

    const celdas: DiaCalendario[] = [];

    // Días del mes anterior para relleno
    const ultimoDiaMesAnterior = new Date(this.anioActual, this.mesActual, 0).getDate();
    for (let i = diaInicio - 1; i >= 0; i--) {
      const diaNum = ultimoDiaMesAnterior - i;
      const fecha = new Date(this.anioActual, this.mesActual - 1, diaNum);
      const fStr = this.formatearFechaLocal(fecha);
      celdas.push({
        fecha,
        fechaStr: fStr,
        numero: diaNum,
        esMesActual: false,
        esHoy: fStr === hoyStr,
        esSeleccionado: fStr === this.diaSeleccionadoStr,
        turnos: this.obtenerTurnosPorFecha(fStr)
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      const fStr = this.formatearFechaLocal(fecha);
      celdas.push({
        fecha,
        fechaStr: fStr,
        numero: dia,
        esMesActual: true,
        esHoy: fStr === hoyStr,
        esSeleccionado: fStr === this.diaSeleccionadoStr,
        turnos: this.obtenerTurnosPorFecha(fStr)
      });
    }

    // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
    const resto = celdas.length % 7;
    if (resto !== 0) {
      const diasRelleno = 7 - resto;
      for (let dia = 1; dia <= diasRelleno; dia++) {
        const fecha = new Date(this.anioActual, this.mesActual + 1, dia);
        const fStr = this.formatearFechaLocal(fecha);
        celdas.push({
          fecha,
          fechaStr: fStr,
          numero: dia,
          esMesActual: false,
          esHoy: fStr === hoyStr,
          esSeleccionado: fStr === this.diaSeleccionadoStr,
          turnos: this.obtenerTurnosPorFecha(fStr)
        });
      }
    }

    this.cuadriculaDias = celdas;
  }

  obtenerTurnosPorFecha(fechaStr: string): Turno[] {
    return this.turnosDelMes.filter((t) => {
      const tFechaStr = (typeof t.fecha === 'string' ? t.fecha : new Date(t.fecha).toISOString()).split('T')[0];
      if (tFechaStr !== fechaStr) return false;
      if (this.filtroEstado !== 'Todos') {
        return t.estado === this.filtroEstado;
      }
      return true;
    });
  }

  seleccionarDia(dia: DiaCalendario): void {
    this.diaSeleccionadoStr = dia.fechaStr;
    this.cuadriculaDias.forEach(d => {
      d.esSeleccionado = d.fechaStr === this.diaSeleccionadoStr;
    });
    this.actualizarTurnosDiaSeleccionado();
  }

  actualizarTurnosDiaSeleccionado(): void {
    this.turnosDelDiaSeleccionado = this.obtenerTurnosPorFecha(this.diaSeleccionadoStr);
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.cargarTurnos();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.cargarTurnos();
  }

  irAHoy(): void {
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
    this.diaSeleccionadoStr = this.formatearFechaLocal(hoy);
    this.cargarTurnos();
  }

  cambiarFiltroEstado(nuevoFiltro: string): void {
    this.filtroEstado = nuevoFiltro;
    this.generarCalendario();
    this.actualizarTurnosDiaSeleccionado();
  }

  // Modales
  abrirModalNuevoTurno(fechaPredefinida?: string): void {
    this.turnoAEditar = undefined;
    this.fechaInicialParaNuevoTurno = fechaPredefinida || this.diaSeleccionadoStr || this.formatearFechaLocal(new Date());
    this.mostrarModalForm = true;
  }

  abrirModalEditar(turno: Turno): void {
    this.cerrarModalDetalle();
    this.turnoAEditar = turno;
    this.mostrarModalForm = true;
  }

  abrirModalDetalle(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.mostrarModalDetalle = true;
  }

  cerrarModalForm(): void {
    this.mostrarModalForm = false;
    this.turnoAEditar = undefined;
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.turnoSeleccionado = null;
  }

  onTurnoGuardado(): void {
    this.cerrarModalForm();
    this.cargarTurnos();
  }

  cancelarTurno(turno: Turno): void {
    if (!turno._id) return;
    if (!confirm('¿Estás seguro de cancelar este turno?')) return;

    this.turnosService.cancelarTurno(turno._id).subscribe({
      next: () => {
        this.snackbarService.show('Turno cancelado correctamente.', 'success');
        this.cerrarModalDetalle();
        this.cargarTurnos();
      },
      error: () => {
        this.snackbarService.show('Error al cancelar el turno.', 'error');
      }
    });
  }

  eliminarTurno(turno: Turno): void {
    if (!turno._id) return;
    if (!confirm('¿Estás seguro de eliminar permanentemente este turno?')) return;

    this.turnosService.eliminarTurno(turno._id).subscribe({
      next: () => {
        this.snackbarService.show('Turno eliminado correctamente.', 'success');
        this.cerrarModalDetalle();
        this.cargarTurnos();
      },
      error: () => {
        this.snackbarService.show('Error al eliminar el turno.', 'error');
      }
    });
  }

  // Helpers para pacientes
  getNombrePaciente(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return `${idPaciente.nombre} ${idPaciente.apellido}`;
    }
    return 'Paciente';
  }

  getDniPaciente(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return idPaciente.dni || '';
    }
    return '';
  }

  getIdPaciente(idPaciente: string | Paciente): string {
    if (typeof idPaciente === 'object' && idPaciente !== null) {
      return idPaciente._id || '';
    }
    return idPaciente || '';
  }

  // Estilos de badges por estado
  getClaseEstado(estado: EstadoTurno): string {
    switch (estado) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-300 dark:border-green-700';
      case 'Completado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-700 line-through';
      case 'Pendiente':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700';
    }
  }

  getDotEstado(estado: EstadoTurno): string {
    switch (estado) {
      case 'Confirmado':
        return 'bg-green-500';
      case 'Completado':
        return 'bg-gray-400';
      case 'Cancelado':
        return 'bg-red-500';
      case 'Pendiente':
      default:
        return 'bg-blue-500';
    }
  }
}
