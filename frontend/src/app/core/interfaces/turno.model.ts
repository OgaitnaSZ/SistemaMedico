import { Paciente } from './paciente.model';

export type EstadoTurno = 'Pendiente' | 'Confirmado' | 'Completado' | 'Cancelado';

export interface Turno {
  _id?: string;
  idDoctor?: string;
  idPaciente: string | Paciente;
  fecha: string | Date;
  hora: string;
  estado: EstadoTurno;
  motivo?: string;
  notas?: string;
  createdAt?: Date;
}
