import { Pencil, Trash2, Calendar, BookOpen } from "lucide-react";
import { useSemestreStore } from "../stores/semestreStore";
import { useState } from "react";

export default function SemestreTable() {
    const { semestres, deleteSemestre, setSelectedSemestre } = useSemestreStore();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number, numero: number, annee: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer le Semestre ${numero} - ${annee} ?`)) {
            setDeletingId(id);
            try {
                await deleteSemestre(id);
            } catch (error: any) {
                alert(error?.response?.data?.message || "Erreur lors de la suppression");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const getSemestreColor = (numero: number) => {
        if (numero % 2 === 0) {
            return "from-purple-100 to-purple-200 text-purple-700";
        } else {
            return "from-blue-100 to-blue-200 text-blue-700";
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="block lg:hidden">
                {semestres.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">Aucun semestre trouvé</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Ajoutez votre premier semestre
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {semestres.map((semestre) => (
                            <div key={semestre.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getSemestreColor(semestre.numero)} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-sm font-bold">S{semestre.numero}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Semestre {semestre.numero}
                                            </h3>
                                            <p className="text-xs text-gray-500">{semestre.anneeUniversitaire}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setSelectedSemestre(semestre)}
                                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(semestre.id, semestre.numero, semestre.anneeUniversitaire)}
                                            disabled={deletingId === semestre.id}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                                    <BookOpen size={14} className="text-gray-400" />
                                    <span>
                                        {semestre._count?.cours || semestre.cours?.length || 0} cours associé(s)
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
                                Semestre
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Année universitaire
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Nombre de cours
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {semestres.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm font-medium">Aucun semestre trouvé</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ajoutez votre premier semestre
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            semestres.map((semestre) => (
                                <tr
                                    key={semestre.id}
                                    className="transition-colors hover:bg-gray-50/80 group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getSemestreColor(semestre.numero)} flex items-center justify-center flex-shrink-0 ring-2 ring-white`}>
                                                <span className="text-xs font-bold">S{semestre.numero}</span>
                                            </div>
                                            <span className="font-semibold text-gray-900">
                                                Semestre {semestre.numero}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                                            <Calendar size={14} className="text-gray-400" />
                                            {semestre.anneeUniversitaire}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                            <BookOpen size={12} />
                                            {semestre._count?.cours || semestre.cours?.length || 0} cours
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedSemestre(semestre)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-95"
                                                title="Modifier ce semestre"
                                            >
                                                <Pencil size={14} />
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(semestre.id, semestre.numero, semestre.anneeUniversitaire)}
                                                disabled={deletingId === semestre.id}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Supprimer ce semestre"
                                            >
                                                <Trash2 size={14} />
                                                {deletingId === semestre.id ? "Suppression..." : "Supprimer"}
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