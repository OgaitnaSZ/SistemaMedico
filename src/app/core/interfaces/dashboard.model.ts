export interface Dashboard {
  statsUltimos7Dias: {
    [dia: string]: DiaEstadistica; // ejemplo: "lunes", "martes"
  };
  ultimoPaciente: UltimoPaciente | null;
  ultimas10Consultas: Consulta[];
  ultimos10Archivos: Archivo[];
}

export interface DiaEstadistica {
  pacientes: number;
  consultas: number;
  archivos: number;
}

export interface UltimoPaciente {
  idPaciente: number;
  nombre: string;
  apellido: string;
  dni: string;
  genero: string;
  ultima_visita: Date;
}

export interface Consulta {
  idPaciente: string;
  nombre: string;
  apellido: string;
  fecha: Date; 
}

export interface Archivo {
  path: string;
  created_at: Date; 
}
