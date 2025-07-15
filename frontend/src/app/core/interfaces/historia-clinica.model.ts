export interface HistoriaClinica {
  idHistoriaClinica: string;
  idPaciente: string;
  fecha: Date;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  parametros?: Parametro[];
  created_at: Date;
}

export interface Parametro {
  nombre: string;
  valor: string;
}
