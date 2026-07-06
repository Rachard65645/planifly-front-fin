import { Pencil, Trash2 } from "lucide-react";
import { useSalleStore } from "../stores/salleStore";

export default function SalleTable() {
  const { salles, deleteSalle, setSelectedSalle } = useSalleStore();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <th className="px-6 py-3.5">Code</th>
            <th className="px-6 py-3.5">Nom</th>
            <th className="px-6 py-3.5">Capacité</th>
            <th className="px-6 py-3.5">Type</th>
            <th className="px-6 py-3.5">Statut</th>
            <th className="px-6 py-3.5 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {salles.map((salle) => (
            <tr
              key={salle.id}
              className="transition-colors hover:bg-gray-50/80"
            >
              <td className="px-6 py-4 font-medium text-gray-900">
                {salle.code}
              </td>
              <td className="px-6 py-4 text-gray-700">{salle.nom}</td>
              <td className="px-6 py-4 text-gray-700">{salle.capacite}</td>
              <td className="px-6 py-4 text-gray-700">{salle.typeSalle}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    salle.status === "Disponible"
                      ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                      : salle.status === "Occupée"
                      ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                      : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                  }`}
                >
                  {salle.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedSalle(salle)}
                    className="rounded-lg bg-amber-500 p-2 text-white transition-colors hover:bg-amber-600"
                    title="Modifier"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteSalle(salle.id)}
                    className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}