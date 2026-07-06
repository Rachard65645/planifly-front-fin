import { Pencil, Trash2, BookOpen } from "lucide-react";
import { useFiliereStore } from "../stores/filiereStore";

export default function FiliereTable() {
  const { filieres, deleteFiliere, setSelectedFiliere } = useFiliereStore();

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette filière ?")) {
      try {
        await deleteFiliere(id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-6 py-3.5">N°</th>
            <th className="px-6 py-3.5">Nom</th>
            <th className="px-6 py-3.5">Description</th>
            <th className="px-6 py-3.5">Date de création</th>
            <th className="px-6 py-3.5 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {filieres.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                <BookOpen size={24} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Aucune filière trouvée</p>
                <p className="text-xs text-gray-400 mt-1">
                  Créez votre première filière
                </p>
              </td>
            </tr>
          ) : (
            filieres.map((filiere, index) => (
              <tr
                key={filiere.id}
                className="transition-colors hover:bg-gray-50/80"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {filiere.nom}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs text-gray-700 truncate">
                    {filiere.description}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {filiere.createdAt
                    ? new Date(filiere.createdAt).toLocaleDateString("fr-FR")
                    : "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedFiliere(filiere)}
                      className="rounded-lg bg-amber-500 p-2 text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(filiere.id)}
                      className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}