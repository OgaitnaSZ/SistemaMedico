export interface Usuario {
  _id: string;
  nombre: string;
  user: string;
  password: string; // Hash
  created_at: Date;
}