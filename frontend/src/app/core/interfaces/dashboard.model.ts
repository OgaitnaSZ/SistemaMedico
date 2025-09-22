export interface Dashboard {
  statsUltimos7Dias: DiaEstadisticaConDia[];
  ultimoPaciente: UltimoPaciente | null;
  ultimas10Consultas: Consulta[];
  ultimos10Archivos: Archivo[];
}

export interface DiaEstadisticaConDia {
  dia: string;
  fecha?: string;   
  pacientes: number;
  consultas: number;
  archivos: number;
}

export interface UltimoPaciente {
  idPaciente: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  dni: string;
  genero: string;
  ultima_visita: Date;
}

export interface Consulta {
  idPaciente: string;
  nombreCompleto: string;
  fecha: Date; 
}

export interface Archivo {
  _id: string;
  nombre: string;
  url: string;
  created_at: Date; 
}
