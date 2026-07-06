import { useEffect, useState } from "react";
import { useFiliereStore } from "../stores/filiereStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function FiliereForm() {
    const { selectedFiliere, setSelectedFiliere, createFiliere, updateFiliere, error } =
        useFiliereStore();

    const [form, setForm] = useState({
        nom: "",
        description: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (selectedFiliere) {
            setForm({
                nom: selectedFiliere.nom,
                description: selectedFiliere.description,
            });
        } else {
            setForm({
                nom: "",
                description: "",
            });
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedFiliere]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

        if (!form.nom.trim() || !form.description.trim()) {
            setLocalError("Le nom et la description sont obligatoires");
            return;
        }

        if (form.nom.trim().length < 2) {
            setLocalError("Le nom doit contenir au moins 2 caractères");
            return;
        }

        try {
            if (selectedFiliere) {
                await updateFiliere(selectedFiliere.id, form);
                setSuccessMessage("Filière modifiée avec succès !");
            } else {
                await createFiliere(form);
                setSuccessMessage("Filière créée avec succès !");
            }

            setTimeout(() => {
                setSuccessMessage("");
                setSelectedFiliere(null);
            }, 1500);

        } catch (err: any) {
            setLocalError(
                err?.response?.data?.message ||
                "Une erreur est survenue"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                    {selectedFiliere ? "Modifier une filière" : "Nouvelle filière"}
                </h2>
            </div>

            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/20 border border-green-500/30 p-3 text-sm text-green-300 backdrop-blur-sm">
                    <CheckCircle2 size={16} />
                    <span>{successMessage}</span>
                </div>
            )}

            {(localError || error) && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-300 backdrop-blur-sm">
                    <AlertCircle size={16} />
                    <span>{localError || error}</span>
                </div>
            )}

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/90">
                    Nom de la filière <span className="text-red-400">*</span>
                </label>
                <input
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Informatique, Mathématiques..."
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/90">
                    Description <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Décrivez la filière, ses objectifs..."
                    rows={4}
                    className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg shadow-blue-500/20"
                >
                    {selectedFiliere ? (
                        <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={16} />
                            Mettre à jour
                        </span>
                    ) : (
                        "Créer la filière"
                    )}
                </button>

                {selectedFiliere && (
                    <button
                        type="button"
                        onClick={() => setSelectedFiliere(null)}
                        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
}