import { useEffect, useState } from "react";
import { useEnseignantStore } from "../stores/enseignantStore";
import { AlertCircle, CheckCircle2, Save, UserPlus, X } from "lucide-react";

export default function EnseignantForm() {
    const { selectedEnseignant, setSelectedEnseignant, createEnseignant, updateEnseignant, error } =
        useEnseignantStore();

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        specialite: "",
        disponibilite: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedEnseignant) {
            setForm({
                nom: selectedEnseignant.nom,
                prenom: selectedEnseignant.prenom,
                email: selectedEnseignant.email,
                telephone: selectedEnseignant.telephone || "",
                specialite: selectedEnseignant.specialite || "",
                disponibilite: selectedEnseignant.disponibilite || "",
            });
        } else {
            resetForm();
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedEnseignant]);

    const resetForm = () => {
        setForm({
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            specialite: "",
            disponibilite: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

        if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim()) {
            setLocalError("Le nom, le prénom et l'email sont obligatoires");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setLocalError("Veuillez entrer un email valide");
            return;
        }

        if (form.telephone && !/^[+]?[\d\s-]{8,}$/.test(form.telephone)) {
            setLocalError("Veuillez entrer un numéro de téléphone valide");
            return;
        }

        setIsSubmitting(true);
        try {
            if (selectedEnseignant) {
                await updateEnseignant(selectedEnseignant.id, form);
                setSuccessMessage("Enseignant modifié avec succès !");
            } else {
                await createEnseignant(form);
                setSuccessMessage("Enseignant créé avec succès !");
                resetForm();
            }

            setTimeout(() => {
                setSuccessMessage("");
                if (selectedEnseignant) {
                    setSelectedEnseignant(null);
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
        setSelectedEnseignant(null);
        resetForm();
        setSuccessMessage("");
        setLocalError("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedEnseignant ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                        {selectedEnseignant ? (
                            <Save size={18} className="text-amber-300" />
                        ) : (
                            <UserPlus size={18} className="text-blue-300" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {selectedEnseignant ? "Modifier l'enseignant" : "Nouvel enseignant"}
                        </h2>
                        {selectedEnseignant && (
                            <p className="text-xs text-white/60">
                                {selectedEnseignant.prenom} {selectedEnseignant.nom}
                            </p>
                        )}
                    </div>
                </div>

                {selectedEnseignant && (
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
                <div className="flex items-center gap-3 rounded-xl bg-green-500/20 border border-green-500/30 p-4 text-sm text-green-200 backdrop-blur-sm animate-in slide-in-from-top-2">
                    <div className="p-1.5 bg-green-500/30 rounded-full">
                        <CheckCircle2 size={16} className="text-green-300" />
                    </div>
                    <div>
                        <p className="font-medium">{successMessage}</p>
                    </div>
                </div>
            )}

            {(localError || error) && (
                <div className="flex items-center gap-3 rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-sm text-red-200 backdrop-blur-sm">
                    <div className="p-1.5 bg-red-500/30 rounded-full">
                        <AlertCircle size={16} className="text-red-300" />
                    </div>
                    <div>
                        <p className="font-medium">{localError || error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-1">
                        Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        placeholder="Ex: Dupont"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-1">
                        Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.prenom}
                        onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        placeholder="Ex: Jean"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90 flex items-center gap-1">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Ex: jean.dupont@ecole.fr"
                        type="email"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Téléphone
                    </label>
                    <input
                        value={form.telephone}
                        onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                        placeholder="Ex: +33 6 12 34 56 78"
                        type="tel"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Spécialité
                    </label>
                    <input
                        value={form.specialite}
                        onChange={(e) => setForm({ ...form, specialite: e.target.value })}
                        placeholder="Ex: Mathématiques, Physique..."
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                    <p className="text-xs text-white/40 mt-1">
                        Entrez la spécialité de l'enseignant
                    </p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90">
                        Disponibilité
                    </label>
                    <select
                        value={form.disponibilite}
                        onChange={(e) => setForm({ ...form, disponibilite: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner un statut
                        </option>
                        <option value="Disponible" className="bg-gray-800 text-white">
                            🟢 Disponible
                        </option>
                        <option value="Occupé" className="bg-gray-800 text-white">
                            🔴 Occupé
                        </option>
                        <option value="En congé" className="bg-gray-800 text-white">
                            🟡 En congé
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {selectedEnseignant ? "Mise à jour..." : "Création..."}
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            {selectedEnseignant ? "Mettre à jour" : "Créer l'enseignant"}
                        </>
                    )}
                </button>

                {selectedEnseignant && (
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