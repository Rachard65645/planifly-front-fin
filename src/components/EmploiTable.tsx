import { Pencil, Trash2, Clock, MapPin, Users, BookOpen, Calendar } from "lucide-react";
import { useEmploiStore } from "../stores/emploiStore";
import { useState } from "react";

export default function EmploiTable() {
    const { emplois, deleteEmploi, setSelectedEmploi } = useEmploiStore();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce planning ?")) {
            setDeletingId(id);
            try {
                await deleteEmploi(id);
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
            } finally {
                setDeletingId(null);
            }
        }
    };

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case "Planifié":
                return "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-600/20";
            case "En cours":
                return "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20";
            case "Terminé":
                return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20";
            case "Annulé":
                return "bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20";
            default:
                return "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-600/20";
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const dates = [...new Set(emplois.map(e => e.dateCours.split("T")[0]))].sort();

    const filteredEmplois = selectedDate
        ? emplois.filter(e => e.dateCours.split("T")[0] === selectedDate)
        : emplois;

    const groupedByDate = filteredEmplois.reduce((acc, emploi) => {
        const date = emploi.dateCours.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(emploi);
        return acc;
    }, {} as Record<string, typeof emplois>);

    const sortedDates = Object.keys(groupedByDate).sort();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="">Toutes les dates</option>
                    {dates.map((date) => (
                        <option key={date} value={date}>
                            {formatDate(date)}
                        </option>
                    ))}
                </select>
            </div>

            {sortedDates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Aucun planning trouvé</p>
                    <p className="text-sm text-gray-400 mt-1">Ajoutez votre premier planning</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedDates.map((date) => (
                        <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                                <h3 className="text-white font-semibold text-lg">
                                    {formatDate(date)}
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {groupedByDate[date]
                                    .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
                                    .map((emploi) => (
                                        <div
                                            key={emploi.id}
                                            className="p-6 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                                                            <Clock size={16} className="text-blue-600" />
                                                            <span className="font-semibold text-blue-700">
                                                                {emploi.heureDebut} - {emploi.heureFin}
                                                            </span>
                                                        </div>
                                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(emploi.statut)}`}>
                                                            {emploi.statut}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <BookOpen size={16} className="text-gray-400 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium">{emploi.cours?.nom}</p>
                                                                <p className="text-xs text-gray-500">{emploi.cours?.typeCours}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium">{emploi.salle?.nom}</p>
                                                                <p className="text-xs text-gray-500">{emploi.salle?.code}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Users size={16} className="text-gray-400 flex-shrink-0" />
                                                            <div>
                                                                <p className="font-medium">
                                                                    {emploi.enseignant?.prenom} {emploi.enseignant?.nom}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => setSelectedEmploi(emploi)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-95"
                                                    >
                                                        <Pencil size={14} />
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(emploi.id)}
                                                        disabled={deletingId === emploi.id}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={14} />
                                                        {deletingId === emploi.id ? "Suppression..." : "Supprimer"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}