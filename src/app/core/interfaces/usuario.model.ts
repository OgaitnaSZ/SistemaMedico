export interface Usuario {
  idUsuario: number;
  nombre: string;
  user: string;
  password: string; // Hash
  created_at: Date;
}