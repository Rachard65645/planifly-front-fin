export interface Emploi {
  id: number;
  dateCours: string;
  heureDebut: string;
  heureFin: string;
  statut: string;
  cours_id: number;
  salle_id: number;
  enseignant_id: number;
  createdAt?: string;
  updatedAt?: string;
  cours?: {
    id: number;
    nom: string;
    code: string;
    typeCours: string;
    filiere_id: number;
  };
  salle?: {
    id: number;
    code: string;
    nom: string;
  };
  enseignant?: {
    id: number;
    nom: string;
    prenom: string;
  };
}