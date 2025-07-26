export interface Consulta {
  _id: string;
  idPaciente: string;
  fecha: Date;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  parametros?: Parametro[];
}

export interface Parametro {
  nombre: string;
  valor: string;
}
