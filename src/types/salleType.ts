export interface Salle {
  id: number;
  code: string;
  nom: string | null;
  capacite: string | null;
  typeSalle: string;
  equipements: string | null;
  status: string;
}