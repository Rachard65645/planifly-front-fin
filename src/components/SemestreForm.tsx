import { useEffect, useState } from "react";
import { useSemestreStore } from "../stores/semestreStore";
import { AlertCircle, CheckCircle2, Save, Calendar, X } from "lucide-react";

export default function SemestreForm() {
    const { selectedSemestre, setSelectedSemestre, createSemestre, updateSemestre, error } =
        useSemestreStore();

    const [form, setForm] = useState({
        numero: "",
        anneeUniversitaire: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentYear = new Date().getFullYear();
    const anneeUniversitaires = [
        `${currentYear}-${currentYear + 1}`,
        `${currentYear - 1}-${currentYear}`,
        `${currentYear + 1}-${currentYear + 2}`,
    ];

    useEffect(() => {
        if (selectedSemestre) {
            setForm({
                numero: selectedSemestre.numero.toString(),
                anneeUniversitaire: selectedSemestre.anneeUniversitaire,
            });
        } else {
            resetForm();
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedSemestre]);

    const resetForm = () => {
        setForm({
            numero: "",
            anneeUniversitaire: anneeUniversitaires[0],
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

        if (!form.numero || !form.anneeUniversitaire) {
            setLocalError("Tous les champs sont obligatoires");
            return;
        }

        const numeroValue = Number(form.numero);
        if (isNaN(numeroValue) || numeroValue < 1 || numeroValue > 12) {
            setLocalError("Le numéro doit être compris entre 1 et 12");
            return;
        }

        if (!Number.isInteger(numeroValue)) {
            setLocalError("Le numéro doit être un nombre entier");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                numero: numeroValue,
                anneeUniversitaire: form.anneeUniversitaire,
            };

            if (selectedSemestre) {
                await updateSemestre(selectedSemestre.id, data);
                setSuccessMessage("Semestre modifié avec succès !");
            } else {
                await createSemestre(data);
                setSuccessMessage("Semestre créé avec succès !");
                resetForm();
            }

            setTimeout(() => {
                setSuccessMessage("");
                if (selectedSemestre) {
                    setSelectedSemestre(null);
                }
            }, 2000);
        } catch (err: any) {
            setLocalError(
                err?.response?.data?.message || "Une erreur est survenue"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedSemestre(null);
        resetForm();
        setSuccessMessage("");
        setLocalError("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedSemestre ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                        <Calendar size={18} className={selectedSemestre ? "text-amber-300" : "text-blue-300"} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {selectedSemestre ? "Modifier le semestre" : "Nouveau semestre"}
                        </h2>
                        {selectedSemestre && (
                            <p className="text-xs text-white/60">
                                S{selectedSemestre.numero} - {selectedSemestre.anneeUniversitaire}
                            </p>
                        )}
                    </div>
                </div>

                {selectedSemestre && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Annuler"
                    >
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
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Numéro du semestre <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        value={form.numero}
                        onChange={(e) => setForm({ ...form, numero: e.target.value })}
                        placeholder="Ex: 1, 2, 3..."
                        min="1"
                        max="12"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                    <p className="text-xs text-white/40 mt-1">
                        Entrez un numéro entre 1 et 12
                    </p>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Année universitaire <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.anneeUniversitaire}
                        onChange={(e) => setForm({ ...form, anneeUniversitaire: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner une année
                        </option>
                        {anneeUniversitaires.map((annee) => (
                            <option key={annee} value={annee} className="bg-gray-800 text-white">
                                {annee}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {form.numero && form.anneeUniversitaire && !isNaN(Number(form.numero)) && Number(form.numero) >= 1 && Number(form.numero) <= 12 && (
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                    <p className="text-white/60 text-xs mb-1">Aperçu du semestre</p>
                    <p className="text-white font-bold text-lg">
                        Semestre {form.numero} - {form.anneeUniversitaire}
                    </p>
                </div>
            )}

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {selectedSemestre ? "Mise à jour..." : "Création..."}
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            {selectedSemestre ? "Mettre à jour" : "Créer le semestre"}
                        </>
                    )}
                </button>

                {selectedSemestre && (
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