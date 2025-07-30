export interface Paciente {
  _id?: string;
  nombre: string;
  apellido: string;
  genero: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  direccion: string;
  createdAt: Date;
  ultima_visita?: Date;
}