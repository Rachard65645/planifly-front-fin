import { useEffect, useState } from "react";
import { useSalleStore } from "../stores/salleStore";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

export default function SalleForm() {
    const { selectedSalle, setSelectedSalle, createSalle, updateSalle } =
        useSalleStore();

    const [form, setForm] = useState({
        code: "",
        nom: "",
        capacite: "",
        typeSalle: "",
        equipements: "",
        status: "libre",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (selectedSalle) {
            setForm({
                code: selectedSalle.code,
                nom: selectedSalle.nom || "",
                capacite: selectedSalle.capacite || "",
                typeSalle: selectedSalle.typeSalle,
                equipements: selectedSalle.equipements || "",
                status: selectedSalle.status,
            });
        } else {
            setForm({
                code: "",
                nom: "",
                capacite: "",
                typeSalle: "",
                equipements: "",
                status: "libre",
            });
        }
        setSuccessMessage("");
        setLocalError("");
    }, [selectedSalle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");
        setSuccessMessage("");

       
        if (!form.code.trim() || !form.typeSalle) {
            setLocalError("Le code et le type de salle sont obligatoires");
            return;
        }

        try {
            if (selectedSalle) {
                await updateSalle(selectedSalle.id, form);
                setSuccessMessage("Salle modifiée avec succès !");
            } else {
                await createSalle(form);
                setSuccessMessage("Salle créée avec succès !");
            }

            setTimeout(() => {
                setSuccessMessage("");
                setSelectedSalle(null);
            }, 1500);
        } catch (error: any) {
            console.error(error);
            setLocalError(
                error?.response?.data?.message || "Une erreur est survenue"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                    {selectedSalle ? "Modifier une salle" : "Nouvelle salle"}
                </h2>
            </div>

            {successMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/20 border border-green-500/30 p-3 text-sm text-green-300 backdrop-blur-sm">
                    <CheckCircle2 size={16} />
                    <span>{successMessage}</span>
                </div>
            )}

            {localError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/20 border border-red-500/30 p-3 text-sm text-red-300 backdrop-blur-sm">
                    <AlertCircle size={16} />
                    <span>{localError}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Code <span className="text-red-400">*</span>
                    </label>
                    <input
                        value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        placeholder="Ex: S001"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Nom
                    </label>
                    <input
                        value={form.nom}
                        onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        placeholder="Ex: Salle A101"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Capacité
                    </label>
                    <input
                        value={form.capacite}
                        onChange={(e) => setForm({ ...form, capacite: e.target.value })}
                        placeholder="Ex: 30"
                        type="number"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Type de salle <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={form.typeSalle}
                        onChange={(e) => setForm({ ...form, typeSalle: e.target.value })}
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="" className="bg-gray-800 text-white">
                            Choisir un type
                        </option>
                        <option value="Salle classique" className="bg-gray-800 text-white">
                            Salle classique
                        </option>
                        <option value="Laboratoire" className="bg-gray-800 text-white">
                            Laboratoire
                        </option>
                        <option value="Amphithéâtre" className="bg-gray-800 text-white">
                            Amphithéâtre
                        </option>
                    </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-white/90">
                        Équipements
                    </label>
                    <textarea
                        value={form.equipements}
                        onChange={(e) => setForm({ ...form, equipements: e.target.value })}
                        placeholder="Ex: Vidéoprojecteur, Tableau blanc, 30 chaises"
                        rows={3}
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white placeholder-white/40 transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-white/90">
                        Statut
                    </label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3.5 py-2.5 text-sm text-white capitalize transition-colors focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="libre" className="bg-gray-800 text-white">
                            Libre
                        </option>
                        <option value="occupée" className="bg-gray-800 text-white">
                            Occupée
                        </option>
                        <option value="maintenance" className="bg-gray-800 text-white">
                            Maintenance
                        </option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    {selectedSalle ? "Mettre à jour" : "Créer"}
                </button>

                {selectedSalle && (
                    <button
                        type="button"
                        onClick={() => setSelectedSalle(null)}
                        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
}