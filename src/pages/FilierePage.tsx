import { useEffect, useState } from "react";
import { useFiliereStore } from "../stores/filiereStore";
import FiliereForm from "../components/FiliereForm";
import FiliereTable from "../components/FiliereTable";
import { BookOpen, Loader2, RefreshCw, GraduationCap, Clock } from "lucide-react";

export default function FilierePage() {
  const { getAll, loading, error, filieres } = useFiliereStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: "url('/images/t.jpg')",
          }}
        />
        <div className="text-center relative z-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-400" />
          <p className="mt-4 text-white text-lg">Chargement des filières...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{
          backgroundImage: "url('/images/t.jpg')",
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80" />

      <div className="relative z-10">
        <div className="mx-auto  px-4 sm:px-6 lg:px-8 py-8">

          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <GraduationCap className="h-8 w-8 text-blue-300" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Gestion des filières
                  </h1>
                  <p className="mt-1 text-blue-200/80 text-sm">
                    Gérez les filières de votre établissement
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm border border-white/10">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{filieres.length}</span> filière(s)
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

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-red-500/20 rounded-full">
                  <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[450px_1fr]">

            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl h-fit">
              <FiliereForm />
            </div>

            <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    Liste des filières
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    {loading && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Actualisation...
                      </div>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {filieres.length} élément(s)
                    </span>
                  </div>
                </div>
                
                <FiliereTable />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">Total filières</p>
                  <p className="text-white text-3xl font-bold mt-1">{filieres.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">Dernière ajoutée</p>
                  <p className="text-white text-lg font-bold mt-1 truncate max-w-[200px]">
                    {filieres[0]?.nom || "Aucune"}
                  </p>
                  {filieres[0]?.createdAt && (
                    <p className="text-white/50 text-xs mt-1">
                      {new Date(filieres[0].createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">Dernière mise à jour</p>
                  <p className="text-white text-lg font-bold mt-1">
                    Aujourd'hui
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    {new Date().toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-xs">
              Gestion des filières • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}