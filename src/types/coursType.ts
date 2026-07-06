import type { Semestre } from "./semestreType";

export interface Cours {
  id: number;
  nom: string;
  code: string | null;
  description: string;
  volumeHoraire: number;
  typeCours: string;
  enseignant_id: number;
  filiere_id: number;
  semestre_id: number;
  createdAt?: string;
  updatedAt?: string;
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
  filiere?: {
    id: number;
    nom: string;
  };
  semestre?: Semestre;
}