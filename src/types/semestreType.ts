export interface Semestre {
  id: number;
  numero: number;
  anneeUniversitaire: string;
  createdAt?: string;
  updatedAt?: string;
  cours?: {
    id: number;
    nom: string;
    code: string;
    typeCours: string;
  }[];
  _count?: {
    cours: number;
  };
}