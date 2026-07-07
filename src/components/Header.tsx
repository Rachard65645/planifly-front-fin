import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    BookOpen,
    Building2,
    Calendar,
    GraduationCap,
    Users,
    Menu,
    X,
    LogOut,
    Home,
    Clock,
} from "lucide-react";

const navigation = [
    { name: "Emplois du temps", href: "/emplois", icon: Clock },
    { name: "Salles", href: "/salles", icon: Building2 },
    { name: "Filières", href: "/filiere", icon: GraduationCap },
    { name: "Enseignants", href: "/enseignant", icon: Users },
    { name: "Cours", href: "/cours", icon: BookOpen },
    { name: "Semestres", href: "/semestre", icon: Calendar },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/emplois" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <img
                                    src="/images/logoo.png"
                                    alt="Planify Logo"
                                    className="relative h-10 w-10 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-all"
                                />
                            </div>
                        </Link>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navigation.map((item) => {
                            // const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive(item.href)
                                            ? "bg-blue-500/20 text-white shadow-lg shadow-blue-500/10"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                        }
                                    `}
                                >
                                    {/* <Icon size={16} className={isActive(item.href) ? "text-blue-300" : "text-white/50"} /> */}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/emplois"
                            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Home size={18} />
                            <span className="hidden md:inline">Accueil</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-300/80 hover:text-red-200 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all"
                        >
                            <LogOut size={18} />
                            <span className="hidden md:inline">Déconnexion</span>
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-white/10 py-4 space-y-2 animate-in slide-in-from-top-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive(item.href)
                                            ? "bg-blue-500/20 text-white"
                                            : "text-white/70 hover:text-white hover:bg-white/10"
                                        }
                                    `}
                                >
                                    <Icon
                                        size={20}
                                        className={
                                            isActive(item.href) ? "text-blue-300" : "text-white/50"
                                        }
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="border-t border-white/10 pt-2 mt-2">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300/80 hover:text-red-200 hover:bg-red-500/10 transition-all w-full"
                            >
                                <LogOut size={20} />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}