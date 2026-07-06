import { Pencil, Trash2, Users, Mail, Phone} from "lucide-react";
import { useEnseignantStore } from "../stores/enseignantStore";
import { useState } from "react";

export default function EnseignantTable() {
  const { enseignants, deleteEnseignant, setSelectedEnseignant } = useEnseignantStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet enseignant ?")) {
      setDeletingId(id);
      try {
        await deleteEnseignant(id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusColor = (disponibilite: string | null) => {
    switch (disponibilite) {
      case "Disponible":
        return "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20";
      case "Occupé":
        return "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20";
      case "En congé":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20";
    }
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="block lg:hidden">
        {enseignants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users size={32} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">Aucun enseignant trouvé</p>
            <p className="text-xs text-gray-400 mt-1">
              Ajoutez votre premier enseignant
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {enseignants.map((enseignant) => (
              <div key={enseignant.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-700">
                        {getInitials(enseignant.prenom, enseignant.nom)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {enseignant.prenom} {enseignant.nom}
                      </p>
                      <p className="text-xs text-gray-500">{enseignant.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedEnseignant(enseignant)}
                      className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(enseignant.id)}
                      disabled={deletingId === enseignant.id}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {enseignant.telephone && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Phone size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{enseignant.telephone}</span>
                    </div>
                  )}
                  {enseignant.specialite && (
                    <div className="text-gray-600">
                      <span className="text-xs text-gray-400">Spécialité:</span>
                      <p className="font-medium text-gray-700 text-xs">{enseignant.specialite}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(enseignant.disponibilite)}`}>
                    {enseignant.disponibilite || "Non défini"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Enseignant
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Contact
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Spécialité
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Statut
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {enseignants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Users size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Aucun enseignant trouvé</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ajoutez votre premier enseignant
                  </p>
                </td>
              </tr>
            ) : (
              enseignants.map((enseignant) => (
                <tr
                  key={enseignant.id}
                  className="transition-colors hover:bg-gray-50/80 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 ring-2 ring-white">
                        <span className="text-sm font-bold text-blue-700">
                          {getInitials(enseignant.prenom, enseignant.nom)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {enseignant.prenom} {enseignant.nom}
                        </p>
                        <p className="text-xs text-gray-500">ID: {enseignant.id}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{enseignant.email}</span>
                      </div>
                      {enseignant.telephone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{enseignant.telephone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {enseignant.specialite ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {enseignant.specialite}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Non spécifiée
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(enseignant.disponibilite)}`}>
                      {enseignant.disponibilite || "Non défini"}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-100">
                      <button
                        onClick={() => setSelectedEnseignant(enseignant)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-95"
                        title="Modifier cet enseignant"
                      >
                        <Pencil size={14} />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(enseignant.id)}
                        disabled={deletingId === enseignant.id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer cet enseignant"
                      >
                        <Trash2 size={14} />
                        {deletingId === enseignant.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}