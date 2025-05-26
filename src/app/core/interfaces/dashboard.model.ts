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
  nombre: string;
  apellido: string;
  dni: string;
  genero: string;
  ultima_visita: Date;
  id_consulta: number;
}

export interface Consulta {
  nombre: string;
  apellido: string;
  fecha: Date; 
  idHistoria: number;
}

export interface Archivo {
  path: string;
  created_at: Date; 
}
