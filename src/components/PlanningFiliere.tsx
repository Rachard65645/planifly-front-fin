import { useState, useEffect } from "react";
import { useEmploiStore } from "../stores/emploiStore";
import { useFiliereStore } from "../stores/filiereStore";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const CRENEAUX_FI = [
    { debut: "07:30", fin: "10:30", label: "07:30 - 10:30" },
    { debut: "10:30", fin: "12:30", label: "10:30 - 12:30" },
    { debut: "12:30", fin: "14:00", label: "12:30 - 14:00" },
    { debut: "14:00", fin: "16:00", label: "14:00 - 16:00" },
    { debut: "16:00", fin: "18:00", label: "16:00 - 18:00" },
];

const CRENEAUX_FA = [
    { debut: "14:00", fin: "16:00", label: "14:00 - 16:00" },
    { debut: "16:00", fin: "18:00", label: "16:00 - 18:00" },
    { debut: "18:00", fin: "20:00", label: "18:00 - 20:00" },
    { debut: "20:00", fin: "22:00", label: "20:00 - 22:00" },
];

export default function PlanningFiliere() {
    const { emplois, getAll } = useEmploiStore();
    const { filieres, getAll: getAllFilieres } = useFiliereStore();
    const [selectedFiliere, setSelectedFiliere] = useState<string>("");
    const [selectedSemaine, setSelectedSemaine] = useState<string>("");
    const [filiereType, setFiliereType] = useState<"FI" | "FA">("FI");

    useEffect(() => {
        getAll();
        getAllFilieres();
        const now = new Date();
        const weekNumber = getWeekNumber(now);
        setSelectedSemaine(`${now.getFullYear()}-W${weekNumber}`);
    }, []);

    useEffect(() => {
        if (filieres.length > 0 && !selectedFiliere) {
            setSelectedFiliere(filieres[0].id.toString());
        }
    }, [filieres]);

    const getWeekNumber = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return weekNo.toString().padStart(2, "0");
    };

    const getMondayOfWeek = (year: number, week: number) => {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dayOfWeek = simple.getDay();
        const monday = new Date(simple);
        if (dayOfWeek <= 4) {
            monday.setDate(simple.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        } else {
            monday.setDate(simple.getDate() + (8 - dayOfWeek));
        }
        return monday;
    };

    const getDateOfWeek = (jourIndex: number) => {
        if (!selectedSemaine) return "";
        const [year, week] = selectedSemaine.split("-W");
        const monday = getMondayOfWeek(Number(year), Number(week));
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + jourIndex);
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, "0");
        const d = String(targetDate.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const getEmploisForFiliere = () => {
        if (!selectedFiliere) return [];
        return emplois.filter(emploi => emploi.cours?.filiere_id === Number(selectedFiliere));
    };

    const heureToMinutes = (heure: string) => {
        const [h, m] = heure.split(":").map(Number);
        return h * 60 + m;
    };

    const isEmploiInCreneau = (emploiHeureDebut: string, emploiHeureFin: string, creneauDebut: string, creneauFin: string) => {
        const eDebut = heureToMinutes(emploiHeureDebut);
        const eFin = heureToMinutes(emploiHeureFin);
        const cDebut = heureToMinutes(creneauDebut);
        const cFin = heureToMinutes(creneauFin);

      
        return (eDebut >= cDebut && eDebut < cFin) ||
            (eFin > cDebut && eFin <= cFin) ||
            (eDebut <= cDebut && eFin >= cFin);
    };

    const getEmploiForCell = (jourIndex: number, creneauIndex: number) => {
        const dateStr = getDateOfWeek(jourIndex);
        const creneaux = filiereType === "FI" ? CRENEAUX_FI : CRENEAUX_FA;
        const creneau = creneaux[creneauIndex];
        const filiereEmplois = getEmploisForFiliere();

        return filiereEmplois.find(emploi => {
            const emploiDate = emploi.dateCours.split("T")[0];
            if (emploiDate !== dateStr) return false;
            return isEmploiInCreneau(emploi.heureDebut, emploi.heureFin, creneau.debut, creneau.fin);
        });
    };

    const getEmploisForDay = (jourIndex: number) => {
        const dateStr = getDateOfWeek(jourIndex);
        const filiereEmplois = getEmploisForFiliere();
        return filiereEmplois
            .filter(emploi => emploi.dateCours.split("T")[0] === dateStr)
            .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut));
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split("-");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
        });
    };

    const isToday = (dateStr: string) => {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, "0");
        const d = String(today.getDate()).padStart(2, "0");
        return dateStr === `${y}-${m}-${d}`;
    };

    const changeSemaine = (direction: number) => {
        if (!selectedSemaine) return;
        const [year, week] = selectedSemaine.split("-W");
        const monday = getMondayOfWeek(Number(year), Number(week));
        monday.setDate(monday.getDate() + direction * 7);
        const newWeek = getWeekNumber(monday);
        setSelectedSemaine(`${monday.getFullYear()}-W${newWeek}`);
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "CM": return "bg-purple-600";
            case "TD": return "bg-blue-600";
            case "TP": return "bg-green-600";
            default: return "bg-gray-600";
        }
    };

    const getTeacherInitials = (nom: string, prenom: string) => {
        return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    };

    const getColorForEnseignant = (enseignantId: number) => {
        const colors = [
            "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
            "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
            "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
            "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
            "bg-rose-500"
        ];
        return colors[enseignantId % colors.length];
    };

    const getCurrentSemaineLabel = () => {
        const date1 = getDateOfWeek(0);
        const date2 = getDateOfWeek(6);
        if (!date1 || !date2) return "";
        return `Semaine du ${formatDate(date1)} au ${formatDate(date2)}`;
    };

    const getEmploisBySalleForCreneau = (jourIndex: number, creneauIndex: number) => {
        const dateStr = getDateOfWeek(jourIndex);
        const creneaux = filiereType === "FI" ? CRENEAUX_FI : CRENEAUX_FA;
        const creneau = creneaux[creneauIndex];
        const filiereEmplois = getEmploisForFiliere();

        return filiereEmplois.filter(emploi => {
            const emploiDate = emploi.dateCours.split("T")[0];
            if (emploiDate !== dateStr) return false;
            return isEmploiInCreneau(emploi.heureDebut, emploi.heureFin, creneau.debut, creneau.fin);
        });
    };

    const getSallesForCreneau = (creneauIndex: number) => {
        const sallesMap = new Map();
        JOURS.forEach((_, jourIndex) => {
            const emploisForDay = getEmploisBySalleForCreneau(jourIndex, creneauIndex);
            emploisForDay.forEach(emploi => {
                if (emploi.salle) {
                    sallesMap.set(emploi.salle.id, {
                        id: emploi.salle.id,
                        code: emploi.salle.code,
                        nom: emploi.salle.nom
                    });
                }
            });
        });
        return Array.from(sallesMap.values()).sort((a, b) => a.code.localeCompare(b.code));
    };

    const creneaux = filiereType === "FI" ? CRENEAUX_FI : CRENEAUX_FA;

    return (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <div className="text-white font-bold text-lg">P</div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-white tracking-wide">
                        PLANNING DE SUIVI DES COURS  ({filiereType})
                    </h1>
                    <p className="text-blue-200 text-lg font-medium">
                        {getCurrentSemaineLabel()}
                    </p>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedFiliere}
                                onChange={(e) => setSelectedFiliere(e.target.value)}
                                className="rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
                            >
                                <option value="" className="bg-gray-800 text-white">Choisir une filière</option>
                                {filieres.map((fil) => (
                                    <option key={fil.id} value={fil.id} className="bg-gray-800 text-white">
                                        {fil.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
                            <button
                                onClick={() => setFiliereType("FI")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filiereType === "FI"
                                    ? "bg-white text-blue-900 shadow-lg"
                                    : "text-white/80 hover:text-white"
                                    }`}
                            >
                                FI
                            </button>
                            <button
                                onClick={() => setFiliereType("FA")}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filiereType === "FA"
                                    ? "bg-white text-blue-900 shadow-lg"
                                    : "text-white/80 hover:text-white"
                                    }`}
                            >
                                FA
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50">
                {!selectedFiliere ? (
                    <div className="text-center py-12 text-gray-500">
                        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Sélectionnez une filière</p>
                        <p className="text-sm text-gray-400 mt-1">Pour afficher le planning correspondant</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => changeSemaine(-1)}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
                                >
                                    <ChevronLeft size={20} className="text-gray-600" />
                                </button>

                                <div className="text-center min-w-[200px] bg-white px-4 py-2 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700">
                                        {getCurrentSemaineLabel()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => changeSemaine(1)}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200 bg-white"
                                >
                                    <ChevronRight size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                                        <th className="p-4 text-center font-bold text-gray-700 border border-gray-300 bg-gray-200 w-20">
                                            SALLES
                                        </th>
                                        <th className="p-4 text-center font-bold text-gray-700 border border-gray-300 bg-gray-200 w-32">
                                            HORAIRES
                                        </th>
                                        {JOURS.map((jour, index) => {
                                            const dateStr = getDateOfWeek(index);
                                            return (
                                                <th
                                                    key={jour}
                                                    className={`p-3 text-center font-bold border border-gray-300 min-w-[120px]
                                                        ${isToday(dateStr)
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                        }
                                                    `}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm">{jour}</span>
                                                        <span className={`text-[10px] font-normal ${isToday(dateStr) ? "text-blue-100" : "text-gray-500"}`}>
                                                            {formatDate(dateStr)}
                                                        </span>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {creneaux.map((creneau, creneauIndex) => {
                                        const sallesForCreneau = getSallesForCreneau(creneauIndex);

                                        if (sallesForCreneau.length === 0) {
                                            return (
                                                <tr key={creneauIndex} className="border-b border-gray-200">
                                                    <td className="p-4 text-center font-medium text-gray-700 border border-gray-300 bg-gray-50">
                                                        -
                                                    </td>
                                                    <td className="p-4 text-center text-gray-600 border border-gray-300 bg-gray-50 font-mono text-sm">
                                                        {creneau.label}
                                                    </td>
                                                    {JOURS.map((_, jourIndex) => (
                                                        <td key={jourIndex} className="p-3 border border-gray-300 bg-gray-50">
                                                            <div className="h-16"></div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        }

                                        return sallesForCreneau.map((salle, salleIndex) => (
                                            <tr key={`${creneauIndex}-${salleIndex}`} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4 text-center font-medium text-gray-700 border border-gray-300 bg-gray-50">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-bold text-blue-700">{salle.code}</span>
                                                        <span className="text-xs text-gray-500">{salle.nom}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-gray-600 border border-gray-300 bg-gray-50 font-mono text-sm">
                                                    {creneau.label}
                                                </td>
                                                {JOURS.map((_, jourIndex) => {
                                                    const dateStr = getDateOfWeek(jourIndex);
                                                    const filiereEmplois = getEmploisForFiliere();
                                                    const emploi = filiereEmplois.find(e => {
                                                        const emploiDate = e.dateCours.split("T")[0];
                                                        if (emploiDate !== dateStr) return false;
                                                        if (e.salle_id !== salle.id) return false;
                                                        return isEmploiInCreneau(e.heureDebut, e.heureFin, creneau.debut, creneau.fin);
                                                    });

                                                    const isTodayCell = isToday(dateStr);

                                                    if (emploi) {
                                                        const typeCours = emploi.cours?.typeCours || "";
                                                        const bgColor = getColorForEnseignant(emploi.enseignant_id);

                                                        return (
                                                            <td key={jourIndex} className={`p-3 border border-gray-300 relative group hover:shadow-lg transition-shadow ${isTodayCell ? 'bg-blue-50' : 'bg-white'}`}>
                                                                <div className="flex flex-col items-center text-center space-y-2">
                                                                    <div className="w-full">
                                                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold text-white rounded ${getTypeBadge(typeCours)}`}>
                                                                            {typeCours}
                                                                        </span>
                                                                    </div>

                                                                    <div className="w-full">
                                                                        <p className="text-xs font-bold text-gray-800 leading-tight">
                                                                            {emploi.cours?.nom || "Cours"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center justify-center gap-1.5">
                                                                        <div className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-[10px] text-white font-bold`}>
                                                                            {getTeacherInitials(emploi.enseignant?.nom || "", emploi.enseignant?.prenom || "")}
                                                                        </div>
                                                                        <span className="text-[10px] text-gray-600 font-medium">
                                                                            {emploi.enseignant?.prenom} {emploi.enseignant?.nom}
                                                                        </span>
                                                                    </div>

                                                                    <div className="text-[10px] text-gray-400 font-mono">
                                                                        {emploi.heureDebut} - {emploi.heureFin}
                                                                    </div>
                                                                </div>

                                                                {/* Tooltip au survol */}
                                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                                    <p className="font-bold">{emploi.cours?.nom}</p>
                                                                    <p>{emploi.enseignant?.prenom} {emploi.enseignant?.nom}</p>
                                                                    <p>Salle {salle.code} • {emploi.heureDebut} - {emploi.heureFin}</p>
                                                                </div>
                                                            </td>
                                                        );
                                                    } else {
                                                        return (
                                                            <td key={jourIndex} className={`p-3 border border-gray-300 ${isTodayCell ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                                                <div className="h-16"></div>
                                                            </td>
                                                        );
                                                    }
                                                })}
                                            </tr>
                                        ));
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Légende des types de cours</h4>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-[10px] font-bold">CM</span>
                                        <span className="text-gray-600">Cours Magistral</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">TD</span>
                                        <span className="text-gray-600">Travaux Dirigés</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-bold">TP</span>
                                        <span className="text-gray-600">Travaux Pratiques</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Informations</h4>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <p>
                                        <span className="font-bold text-blue-700">FI :</span> Formation Initiale
                                        <span className="ml-2 text-gray-400">07:30 - 18:00</span>
                                    </p>
                                    <p>
                                        <span className="font-bold text-blue-700">FA :</span> Formation en Alternance
                                        <span className="ml-2 text-gray-400">14:00 - 22:00</span>
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Année universitaire 2025/2026
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-500">
                    Université de Douala • Institut Universitaire de Technologie • GI 2 • {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}