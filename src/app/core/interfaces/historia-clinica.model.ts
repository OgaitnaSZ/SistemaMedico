export interface HistoriaClinica {
  idHC: number;
  idPaciente: number;
  fecha: Date;
  motivo_consulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  created_at: Date;
}