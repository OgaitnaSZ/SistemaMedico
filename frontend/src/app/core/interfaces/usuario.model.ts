export interface Usuario {
  idUsuario: string;
  nombre: string;
  user: string;
  password: string; // Hash
  created_at: Date;
}