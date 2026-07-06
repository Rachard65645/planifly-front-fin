import { useEffect, useState } from "react";
import { useCoursStore } from "../stores/coursStore";
import { useEnseignantStore } from "../stores/enseignantStore";
import { useFiliereStore } from "../stores/filiereStore";
import { AlertCircle, CheckCircle2, Save, BookOpen, X } from "lucide-react";

export default function CoursForm() {
    const { selectedCours, setSelectedCours, createCours, updateCours, error, semestres } =
        useCoursStore();
    const { enseignants, getAll: getAllEnseignants } = useEnseignantStore();
    const { filieres, getAll: getAllFilieres } = useFiliereStore();

    const [form, setForm] = useState({
        nom: "",
        code: "",
        description: "",
        volumeHoraire: "",
        typeCours: "",
        enseignant_id: "",
        filiere_id: "",
        semestre_id: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getAllEnseignants();
        getAllFilieres();
        useCoursStore.getState().getAllSemestres();
    }, []);

    useEffect(() => {
        if (selectedCours) {
            setForm({
                nom: selectedCours.nom,
                code: selectedCours.code || "",
                description: selectedCours.description,
                volumeHoraire: selectedCours.volumeHoraire.toString(),
                typeCours: selectedCours.typeCours,
                enseignant_id: selectedCours.enseignant_id.toString(),
                filiere_id: selectedCours.filiere_id.toString(),
                semestre_id: selectedCours.semestre_id.toString(),
            });
        } else {
            resetForm();
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedCours]);

    const resetForm = () => {
        setForm({
            nom: "",
            code: "",
            description: "",
            volumeHoraire: "",
            typeCours: "",
            enseignant_id: "",
            filiere_id: "",
            semestre_id: "",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

        if (
            !form.nom.trim() ||
            !form.description.trim() ||
            !form.volumeHoraire ||
            !form.typeCours ||
            !form.enseignant_id ||
            !form.filiere_id ||
            !form.semestre_id
        ) {
            setLocalError("Tous les champs sont obligatoires");
            return;
        }

        if (isNaN(Number(form.volumeHoraire)) || Number(form.volumeHoraire) <= 0) {
            setLocalError("Le volume horaire doit être un nombre positif");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = {
                ...form,
                volumeHoraire: Number(form.volumeHoraire),
                enseignant_id: Number(form.enseignant_id),
                filiere_id: Number(form.filiere_id),
                semestre_id: Number(form.semestre_id),
            };

            if (selectedCours) {
                await updateCours(selectedCours.id, data);
                setSuccessMessage("Cours modifié avec succès !");
            } else {
                await createCours(data);
                setSuccessMessage("Cours créé avec succès !");
                resetForm();
            }

            setTimeout(() => {
                setSuccessMessage("");
                if (selectedCours) {
                    setSelectedCours(null);
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
        setSelectedCours(null);
        resetForm();
        setSuccessMessage("");
        setLocalError("");
    };

    const getSemestreDisplay = (semestre: any) => {
        if (!semestre) return "";
        return `S${semestre.numero} - ${semestre.anneeUniversitaire}`;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedCours ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                        <BookOpen size={18} className={selectedCours ? "text-amber-300" : "text-blue-300"} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            {selectedCours ? "Modifier le cours" : "Nouveau cours"}
                        </h2>
                        {selectedCours && (
                            <p className="text-xs text-white/60">{selectedCours.nom}</p>
                        )}
                    </div>
                </div>

                {selectedCours && (
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
                        Nom du cours <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        placeholder="Ex: Algorithmique avancée"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Code
                    </label>
                    <input
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        placeholder="Ex: INFO301"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90">
                        Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Décrivez le contenu du cours..."
                        rows={3}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] resize-none"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Volume horaire (h) <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.volumeHoraire}
                        onChange={(e) => setForm({ ...form, volumeHoraire: e.target.value })}
                        placeholder="Ex: 30"
                        type="number"
                        min="1"
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Type de cours <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.typeCours}
                        onChange={(e) => setForm({ ...form, typeCours: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner un type
                        </option>
                        <option value="CM" className="bg-gray-800 text-white">
                            CM - Cours Magistral
                        </option>
                        <option value="TD" className="bg-gray-800 text-white">
                            TD - Travaux Dirigés
                        </option>
                        <option value="TP" className="bg-gray-800 text-white">
                            TP - Travaux Pratiques
                        </option>
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
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner un enseignant
                        </option>
                        {enseignants.map((ens) => (
                            <option key={ens.id} value={ens.id} className="bg-gray-800 text-white">
                                {ens.prenom} {ens.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Filière <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.filiere_id}
                        onChange={(e) => setForm({ ...form, filiere_id: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner une filière
                        </option>
                        {filieres.map((fil) => (
                            <option key={fil.id} value={fil.id} className="bg-gray-800 text-white">
                                {fil.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90">
                        Semestre <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.semestre_id}
                        onChange={(e) => setForm({ ...form, semestre_id: e.target.value })}
                        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white transition-all duration-200 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:bg-white/[0.15] cursor-pointer"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Sélectionner un semestre
                        </option>
                        {semestres.map((sem) => (
                            <option key={sem.id} value={sem.id} className="bg-gray-800 text-white">
                                {getSemestreDisplay(sem)}
                            </option>
                        ))}
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
                            {selectedCours ? "Mise à jour..." : "Création..."}
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            {selectedCours ? "Mettre à jour" : "Créer le cours"}
                        </>
                    )}
                </button>

                {selectedCours && (
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