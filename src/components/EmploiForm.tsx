import { useEffect, useState } from "react";
import { useEmploiStore } from "../stores/emploiStore";
import { useCoursStore } from "../stores/coursStore";
import { useSalleStore } from "../stores/salleStore";
import { useEnseignantStore } from "../stores/enseignantStore";
import { AlertCircle, CheckCircle2, Save, Calendar, X, Clock } from "lucide-react";

const CRENEAUX = [
    "07:30", "08:00", "08:30", "09:00", "09:30", "10:00",
    "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
    "16:30", "17:00", "17:30", "18:00", "18:30", "19:00",
    "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
];

export default function EmploiForm() {
    const { selectedEmploi, setSelectedEmploi, createEmploi, updateEmploi, error } =
        useEmploiStore();
    const { cours, getAll: getAllCours } = useCoursStore();
    const { salles, getAll: getAllSalles } = useSalleStore();
    const { enseignants, getAll: getAllEnseignants } = useEnseignantStore();

    const [form, setForm] = useState({
        dateCours: "",
        heureDebut: "",
        heureFin: "",
        statut: "Planifié",
        cours_id: "",
        salle_id: "",
        enseignant_id: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAllCours();
        getAllSalles();
        getAllEnseignants();
    }, []);

    useEffect(() => {
        if (selectedEmploi) {
            setForm({
                dateCours: selectedEmploi.dateCours.split("T")[0],
                heureDebut: selectedEmploi.heureDebut,
                heureFin: selectedEmploi.heureFin,
                statut: selectedEmploi.statut,
                cours_id: selectedEmploi.cours_id.toString(),
                salle_id: selectedEmploi.salle_id.toString(),
                enseignant_id: selectedEmploi.enseignant_id.toString(),
            });
        } else {
            resetForm();
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedEmploi]);

    const resetForm = () => {
        setForm({
            dateCours: "",
            heureDebut: "",
            heureFin: "",
            statut: "Planifié",
            cours_id: "",
            salle_id: "",
            enseignant_id: "",
        });
    };

    const heureToMinutes = (heure: string) => {
        const [h, m] = heure.split(":").map(Number);
        return h * 60 + m;
    };

    const validateHeure = (heure: string): boolean => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(heure);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

        if (
            !form.dateCours ||
            !form.heureDebut ||
            !form.heureFin ||
            !form.cours_id ||
            !form.salle_id ||
            !form.enseignant_id
        ) {
            setLocalError("Tous les champs sont obligatoires");
            return;
        }

        if (!validateHeure(form.heureDebut) || !validateHeure(form.heureFin)) {
            setLocalError("Format d'heure invalide. Utilisez le format HH:MM (ex: 08:30)");
            return;
        }

        if (heureToMinutes(form.heureDebut) < 450) {
            setLocalError("Les cours commencent à partir de 07h30");
            return;
        }

        if (heureToMinutes(form.heureFin) > 1320) {
            setLocalError("Les cours ne peuvent pas dépasser 22h00");
            return;
        }

        if (heureToMinutes(form.heureDebut) >= heureToMinutes(form.heureFin)) {
            setLocalError("L'heure de début doit être avant l'heure de fin");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                ...form,
                cours_id: Number(form.cours_id),
                salle_id: Number(form.salle_id),
                enseignant_id: Number(form.enseignant_id),
            };

            if (selectedEmploi) {
                await updateEmploi(selectedEmploi.id, data);
                setSuccessMessage("Planning modifié avec succès !");
            } else {
                await createEmploi(data);
                setSuccessMessage("Planning créé avec succès !");
                resetForm();
            }

            setTimeout(() => {
                setSuccessMessage("");
                if (selectedEmploi) {
                    setSelectedEmploi(null);
                }
            }, 2000);
        } catch (err: any) {
            setLocalError(err?.response?.data?.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedEmploi(null);
        resetForm();
        setSuccessMessage("");
        setLocalError("");
    };

    const formatDate = (date: string) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedEmploi ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                        <Calendar size={18} className={selectedEmploi ? "text-amber-300" : "text-blue-300"} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {selectedEmploi ? "Modifier le planning" : "Nouveau planning"}
                        </h2>
                        {selectedEmploi && (
                            <p className="text-xs text-white/60">{formatDate(selectedEmploi.dateCours)}</p>
                        )}
                    </div>
                </div>

                {selectedEmploi && (
                    <button type="button" onClick={handleCancel} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X size={18} className="text-white/70" />
                    </button>
                )}
            </div>

            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl bg-green-500/20 border border-green-500/30 p-4 text-sm text-green-200 backdrop-blur-sm">
                    <div className="p-1.5 bg-green-500/30 rounded-full">
                        <CheckCircle2 size={16} className="text-green-300" />
                    </div>
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}

            {(localError || error) && (
                <div className="flex items-center gap-3 rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-200 backdrop-blur-sm">
                    <div className="p-1.5 bg-red-500/30 rounded-full">
                        <AlertCircle size={16} className="text-red-300" />
                    </div>
                    <p className="font-medium">{localError || error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                        <Calendar size={14} className="text-white/60" />
                        Date du cours <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        value={form.dateCours}
                        onChange={(e) => setForm({ ...form, dateCours: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                        <Clock size={14} className="text-white/60" />
                        Heure début <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.heureDebut}
                        onChange={(e) => setForm({ ...form, heureDebut: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer font-mono"
                    >
                        <option value="" className="bg-gray-800 text-white">Choisir l'heure</option>
                        {CRENEAUX.map((heure) => (
                            <option key={heure} value={heure} className="bg-gray-800 text-white">
                                {heure}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-white/40">Créneaux de 07:30 à 22:00</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                        <Clock size={14} className="text-white/60" />
                        Heure fin <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.heureFin}
                        onChange={(e) => setForm({ ...form, heureFin: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer font-mono"
                    >
                        <option value="" className="bg-gray-800 text-white">Choisir l'heure</option>
                        {CRENEAUX.map((heure) => (
                            <option key={heure} value={heure} className="bg-gray-800 text-white">
                                {heure}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-white/40">Créneaux de 07:30 à 22:00</p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Cours <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.cours_id}
                        onChange={(e) => setForm({ ...form, cours_id: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">Sélectionner un cours</option>
                        {cours.map((c) => (
                            <option key={c.id} value={c.id} className="bg-gray-800 text-white">
                                {c.nom} ({c.typeCours})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Salle <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.salle_id}
                        onChange={(e) => setForm({ ...form, salle_id: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">Sélectionner une salle</option>
                        {salles.map((s) => (
                            <option key={s.id} value={s.id} className="bg-gray-800 text-white">
                                {s.code} - {s.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Enseignant <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.enseignant_id}
                        onChange={(e) => setForm({ ...form, enseignant_id: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">Sélectionner un enseignant</option>
                        {enseignants.map((ens) => (
                            <option key={ens.id} value={ens.id} className="bg-gray-800 text-white">
                                {ens.prenom} {ens.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90">Statut</label>
                    <select
                        value={form.statut}
                        onChange={(e) => setForm({ ...form, statut: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="Planifié" className="bg-gray-800 text-white">Planifié</option>
                        <option value="En cours" className="bg-gray-800 text-white">En cours</option>
                        <option value="Terminé" className="bg-gray-800 text-white">Terminé</option>
                        <option value="Annulé" className="bg-gray-800 text-white">Annulé</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {selectedEmploi ? "Mise à jour..." : "Création..."}
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            {selectedEmploi ? "Mettre à jour" : "Créer le planning"}
                        </>
                    )}
                </button>

                {selectedEmploi && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-xl border-2 border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 active:scale-[0.98]"
                    >
                        Annuler
                    </button>
                )}
            </div>

            <p className="text-xs text-white/40 text-center">
                <span className="text-red-400">*</span> Champs obligatoires
            </p>
        </form>
    );
}