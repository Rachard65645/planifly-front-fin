import { useState, useEffect } from 'react';
import { Mail, Lock } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import useLoginStore from '../stores/loginStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error, isAuthenticated, clearError } = useLoginStore();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/emplois');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(formData);
        if (success) {
            navigate('/emplois');
        }
    };

    return (
        <div className="min-h-screen bg-[#001b5c] relative overflow-hidden">

            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: "url('/images/t.jpg')",
                }}
            />

            <div className="relative z-10">

                <div className="grid min-h-screen lg:grid-cols-2">

                    <section className="flex flex-col justify-center px-8 py-12 lg:px-20">

                        <div className="mb-10 flex items-center gap-3">
                            <img
                                src="/images/logoo.png"
                                alt="Planifly"
                                className="h-14 w-14"
                            />
                            <h1 className="text-5xl font-black text-white">planifly</h1>
                        </div>

                        <div className="max-w-xl text-white">
                            <p className="font-semibold mb-6">
                                *Objet : Présentation de Planify – Application de conception d'emploi du temps*
                            </p>
                            <div className="space-y-4 text-sm leading-6 text-white/90">
                                <p>Madame, Monsieur,</p>
                                <p>Nous avons l'honneur de vous présenter Planify, une application de conception d'emploi du temps hebdomadaire.</p>
                                <p>Née d'un projet académique, elle répond aux besoins des établissements scolaires, universitaires et centres de formation.</p>
                                <p>L'application permet de générer automatiquement des emplois du temps optimisés selon les contraintes.</p>
                                <p>Son interface intuitive facilite l'ajout, la modification et la visualisation des créneaux.</p>
                                <p>Elle intègre également un système de détection des conflits et des propositions alternatives.</p>
                                <p>Accessible sur web et mobile, avec export PDF et synchronisation.</p>
                                <p>Nous serions ravis de vous faire une démonstration et d'échanger sur son intégration.</p>
                                <p>L'équipe Planify</p>
                                <p>contact@planify-app.com</p>
                            </div>
                            <div className="mt-10 flex gap-3">
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white" />
                                <span className="h-2 w-2 rounded-full bg-white w-8" />
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center p-6">

                        <div className="w-full max-w-md">

                            <div className="mb-10 flex justify-center lg:hidden">
                                <img src="/logo.png" alt="Planifly" className="h-16 w-16" />
                            </div>

                            <div className="mb-12 flex gap-8 text-white">
                                <Link to="/register" className="text-white/70">s'inscrire</Link>
                                <button className="border-b-2 border-white pb-2 font-medium">se connecter</button>
                            </div>

                            <h2 className="mb-10 text-5xl font-light text-white">BON RETOUR</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div>
                                    <label className="mb-2 block text-sm text-white">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="email@exemple.com"
                                            required
                                            className="h-14 w-full bg-white pl-12 pr-4 text-black rounded-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-white">Mot de passe</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="********"
                                            required
                                            className="h-14 w-full bg-white pl-12 pr-4 text-black rounded-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-white">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Se souvenir de moi
                                    </label>
                                    <button type="button" className="text-white hover:underline">
                                        Mot de passe oublié ?
                                    </button>
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-14 w-56 bg-gradient-to-b from-blue-500 to-blue-700 text-white text-xl font-semibold shadow-xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Connexion..." : "Se connecter"}
                                    </button>
                                </div>

                            </form>

                            <div className="my-8 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/30" />
                                <span className="text-sm text-white">Ou continuer avec</span>
                                <div className="h-px flex-1 bg-white/30" />
                            </div>

                            <div className="flex justify-center gap-6">
                                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <FaFacebook />
                                </button>
                                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <LiaLinkedin />
                                </button>
                            </div>

                            <div className="mt-10 text-center text-sm text-white">
                                Vous n'avez pas encore de compte ?
                                <Link to="/register" className="ml-2 font-bold hover:underline">
                                    S'inscrire
                                </Link>
                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </div>
    );
}