import { useEffect, useState } from "react";
import { useEmploiStore } from "../stores/emploiStore";
import EmploiForm from "../components/EmploiForm";
import EmploiTable from "../components/EmploiTable";
import PlanningFiliere from "../components/PlanningFiliere";
import { Calendar, Loader2, RefreshCw, BookOpen, Users, List, LayoutGrid } from "lucide-react";

export default function EmploiPage() {
  const { getAll, loading, emplois } = useEmploiStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"planning" | "gestion">("planning");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await getAll();
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsInitialLoading(true);
    loadData();
  };

  const totalPlanifies = emplois.filter(e => e.statut === "Planifié").length;
  const totalEnCours = emplois.filter(e => e.statut === "En cours").length;
  const totalTermines = emplois.filter(e => e.statut === "Terminé").length;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/images/t.jpg')" }}
        />
        <div className="text-center relative z-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-400" />
          <p className="mt-4 text-white text-lg">Chargement des plannings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url('/images/t.jpg')" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80" />

      <div className="relative z-10">
        <div className="mx-auto  px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <Calendar className="h-8 w-8 text-blue-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Emplois du temps
                  </h1>
                  <p className="mt-1 text-blue-200/80 text-sm">
                    Gérez et consultez les plannings
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setActiveTab("planning")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "planning"
                        ? "bg-white text-blue-700 shadow-lg"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Planning
                  </button>
                  <button
                    onClick={() => setActiveTab("gestion")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === "gestion"
                        ? "bg-white text-blue-700 shadow-lg"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <List size={16} />
                    Gestion
                  </button>
                </div>
                
                <button
                  onClick={handleRefresh}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
                  title="Actualiser"
                >
                  <RefreshCw className="h-5 w-5 text-white/80" />
                </button>
              </div>
            </div>
          </div>

          {activeTab === "planning" ? (
            <div className="space-y-6">
              <PlanningFiliere />
            </div>
          ) : (
            <>
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Calendar className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium">Planifiés</p>
                      <p className="text-white text-3xl font-bold mt-1">{totalPlanifies}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-xl">
                      <BookOpen className="h-6 w-6 text-green-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium">En cours</p>
                      <p className="text-white text-3xl font-bold mt-1">{totalEnCours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <Users className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm font-medium">Terminés</p>
                      <p className="text-white text-3xl font-bold mt-1">{totalTermines}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl h-fit">
                  <EmploiForm />
                </div>

                <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        Liste des plannings
                      </h2>
                      
                      <div className="flex items-center gap-3">
                        {loading && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Actualisation...
                          </div>
                        )}
                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          {emplois.length} élément(s)
                        </span>
                      </div>
                    </div>
                    
                    <EmploiTable />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs">
              Gestion des emplois du temps • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}