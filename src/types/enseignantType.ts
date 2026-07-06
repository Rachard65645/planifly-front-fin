export interface Enseignant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  specialite: string | null;
  disponibilite: string | null;
  createdAt?: string;
  updatedAt?: string;
}