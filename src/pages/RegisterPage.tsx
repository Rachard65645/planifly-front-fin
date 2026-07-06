import { useState, useEffect } from 'react';
import { FaFacebook } from "react-icons/fa";
import { LiaLinkedin } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import useRegisterStore from '../stores/registerStore';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, success, reset } = useRegisterStore();

    const [formData, setFormData] = useState({
        email: '',
        immatriculation: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        reset();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const registerData = {
            email: formData.email,
            password: formData.password,
            immatriculation: formData.immatriculation
        };

        await register(registerData);
    };

    return (
        <div className="min-h-screen bg-[#001b5c] relative overflow-hidden">

            <div
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{
                    backgroundImage: "url('/images/t.jpg')",
                }}
            />

            <div className="relative z-10 min-h-screen">

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

                    <section className="flex items-center justify-center px-8 py-12">

                        <div className="w-full max-w-md">

                            <div className="mb-12 flex gap-10 text-white">
                                <button className="border-b-2 border-white pb-2 font-medium">
                                    s'inscrire
                                </button>
                                <Link to="/" className="pb-2 text-white/70">
                                    se connecter
                                </Link>
                            </div>

                            <h2 className="mb-10 text-5xl font-light text-white">BIENVENUE</h2>

                            {success && (
                                <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-white text-sm text-center">
                                    Inscription réussie ! Redirection vers la connexion...
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div>
                                    <label className="mb-2 block text-sm text-white">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-14 w-full bg-white px-4 text-black outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-white">Matricule</label>
                                    <input
                                        type="text"
                                        name="immatriculation"
                                        value={formData.immatriculation}
                                        onChange={handleChange}
                                        required
                                        className="h-14 w-full bg-white px-4 text-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-white">Mot de passe</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-14 w-full bg-white px-4 text-black"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-white">Confirmation</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="h-14 w-full bg-white px-4 text-black"
                                    />
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={isLoading || success}
                                        className="h-14 w-52 bg-gradient-to-b from-blue-500 to-blue-700 text-xl font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? "Inscription..." : success ? "Inscrit !" : "s'inscrire"}
                                    </button>
                                </div>

                            </form>

                            <div className="my-8 flex items-center gap-3 text-white">
                                <div className="h-px flex-1 bg-white/40" />
                                <span className="text-sm">Ou continuer avec</span>
                                <div className="h-px flex-1 bg-white/40" />
                            </div>

                            <div className="flex justify-center gap-8">
                                <button className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center">
                                    <FaFacebook size={22} />
                                </button>
                                <button className="h-12 w-12 rounded-full bg-white text-black flex items-center justify-center">
                                    <LiaLinkedin size={22} />
                                </button>
                            </div>

                            <div className="mt-12 text-center text-white text-sm">
                                Vous avez déjà un compte ?
                                <Link to="/" className="ml-2 font-bold hover:underline">
                                    Connexion
                                </Link>
                            </div>

                        </div>

                    </section>

                </div>

            </div>

        </div>
    );
}