// app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { Eye, EyeOff, Facebook, Instagram } from 'lucide-react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/store.js';
import { loginUser } from '../../services/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialButton } from "@/components/SocialButton";
import "@/styles/globals.css";

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  motDePasse: z
    .string()
    .min(8, 'Mot de passe : 8 caractères minimum')
    .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une lettre minuscule')
    .regex(/\d/, 'Doit contenir au moins un chiffre')
    .regex(/[@$!%*?&#]/, 'Doit contenir au moins un caractère spécial'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showmotDePasse, setShowmotDePasse] = useState(false);
  const router = useRouter();
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const response = await loginUser(data.email, data.motDePasse);

      if (!response || !response.token || !response.user) {
        throw new Error('Erreur inconnue');
      }

      const token = response.token;
      localStorage.setItem('token', token);

      setIsAuthenticated(true);
      setUser(response.user);

      router.push('/');
    } catch (error: unknown) {
      console.error('Erreur lors de la connexion:', error);
      if (error instanceof Error) {
        alert(`Connexion échouée : ${error.message}`);
      } else {
        alert('Connexion échouée : Erreur inconnue');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left section with wave design */}
          <div className="relative w-full md:w-1/2 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-8 flex flex-col justify-center">
            {/* Wave decoration */}
            <div className="absolute top-0 right-0 w-16 h-full hidden md:block">
              <div className="absolute inset-0 bg-white" style={{
                clipPath: "polygon(100% 0, 0% 100%, 100% 100%)"
              }}/>
            </div>
            <div className="relative z-10">
              <Image src="/Logo_Orion.jpg" alt="Logo" width={80} height={80} className="rounded-full mb-8" priority />
              <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
              <p className="text-blue-100 mb-6">
                Connectez-vous pour accéder à toutes nos fonctionnalités et trouver les meilleures offres.
              </p>
              <p className="text-sm text-blue-200">www.votresite.com</p>
            </div>
          </div>

          {/* Right section */}
          <div className="w-full md:w-1/2 p-8 bg-white">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Connexion</h2>
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...register('email')} 
                    className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md" 
                    placeholder="Votre email" 
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="motDePasse" className="text-gray-700">Mot de passe</Label>
                  <div className="relative">
                    <Input 
                      id="motDePasse" 
                      type={showmotDePasse ? 'text' : 'password'} 
                      {...register('motDePasse')} 
                      className="mt-1 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md" 
                      placeholder="Mot de passe" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowmotDePasse(!showmotDePasse)} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showmotDePasse ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showmotDePasse ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {errors.motDePasse && <p className="mt-1 text-sm text-red-500">{errors.motDePasse.message}</p>}
                </div>

                <div className="flex items-center justify-between space-x-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                  >
                    Se connecter
                  </Button>
                  <Link 
                    href="/register" 
                    className="flex-1 inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <SocialButton Icon={() => <GoogleIcon />} text="Continuer avec Google" gradient="bg-gradient-to-r from-blue-300 to-green-400" />
                  <SocialButton Icon={Facebook} text="Continuer avec Facebook" gradient="bg-gradient-to-r from-blue-600 to-blue-700" />
                  <SocialButton Icon={Instagram} text="Continuer avec Instagram" gradient="bg-gradient-to-r from-pink-600 to-pink-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path d="M44.5 20H24v8.5h11.8C34.8 32.2 30.2 35.5 24 35.5c-7 0-12.5-5.5-12.5-12.5S17 10.5 24 10.5c3.2 0 6.1 1.2 8.4 3.3l6.3-6.3C34.2 5 29.4 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.8 0 19.7-7.8 21-18h-8.5z" />
    </svg>
  );
}

