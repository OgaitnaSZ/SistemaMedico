export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  password: string; // Hash
  created_at: Date;
}