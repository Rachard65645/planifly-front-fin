import { Pencil, Trash2, BookOpen, Clock, Users, GraduationCap } from "lucide-react";
import { useCoursStore } from "../stores/coursStore";
import { useState } from "react";

export default function CoursTable() {
    const { cours, deleteCours, setSelectedCours } = useCoursStore();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
            setDeletingId(id);
            try {
                await deleteCours(id);
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "CM":
                return "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-600/20";
            case "TD":
                return "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20";
            case "TP":
                return "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20";
            default:
                return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20";
        }
    };

    const getSemestreDisplay = (semestre: any) => {
        if (!semestre) return "Non défini";
        if (semestre.numero && semestre.anneeUniversitaire) {
            return `S${semestre.numero} - ${semestre.anneeUniversitaire}`;
        }
        return semestre.nom || "Non défini";
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="block lg:hidden">
                {cours.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <BookOpen size={32} className="mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">Aucun cours trouvé</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Ajoutez votre premier cours
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {cours.map((c) => (
                            <div key={c.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{c.nom}</h3>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(c.typeCours)}`}>
                                                {c.typeCours}
                                            </span>
                                        </div>
                                        {c.code && (
                                            <p className="text-xs text-gray-500 mb-1">Code: {c.code}</p>
                                        )}
                                        <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                                    </div>

                                    <div className="flex items-center gap-1 ml-3">
                                        <button
                                            onClick={() => setSelectedCours(c)}
                                            className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            disabled={deletingId === c.id}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                        <span>{c.volumeHoraire}h</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{c.enseignant?.prenom} {c.enseignant?.nom}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <GraduationCap size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{c.filiere?.nom}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{getSemestreDisplay(c.semestre)}</span>
                                    </div>
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
                                Cours
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Type
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Volume
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Enseignant
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Filière
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Semestre
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {cours.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    <BookOpen size={32} className="mx-auto mb-3 text-gray-400" />
                                    <p className="text-sm font-medium">Aucun cours trouvé</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ajoutez votre premier cours
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            cours.map((c) => (
                                <tr
                                    key={c.id}
                                    className="transition-colors hover:bg-gray-50/80 group"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">{c.nom}</p>
                                            {c.code && (
                                                <p className="text-xs text-gray-500 mt-0.5">Code: {c.code}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-[200px]">
                                                {c.description}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTypeColor(c.typeCours)}`}>
                                            {c.typeCours}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-700">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="font-medium">{c.volumeHoraire}h</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Users size={14} className="text-blue-600" />
                                            </div>
                                            <span className="text-sm text-gray-700">
                                                {c.enseignant?.prenom} {c.enseignant?.nom}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                                            {c.filiere?.nom}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">
                                            {getSemestreDisplay(c.semestre)}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedCours(c)}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-95"
                                                title="Modifier ce cours"
                                            >
                                                <Pencil size={14} />
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                disabled={deletingId === c.id}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Supprimer ce cours"
                                            >
                                                <Trash2 size={14} />
                                                {deletingId === c.id ? "Suppression..." : "Supprimer"}
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