// app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import for simulated navigation
import Link from 'next/link'; // Import Link from next/link
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { Eye, EyeOff, Facebook, Instagram } from 'lucide-react';
import { SocialButton } from "@/components/SocialButton";
import "@/styles/globals.css";
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schéma de validation Zod pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Mot de passe : 8 caractères minimum')
    .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une lettre minuscule')
    .regex(/\d/, 'Doit contenir au moins un chiffre')
    .regex(/[@$!%*?&#]/, 'Doit contenir au moins un caractère spécial'),
}).refine((data) => data.password === data.password, {
    path: ['password'], // Où afficher l'erreur
    message: 'Les mots de passe est incorrecte',
  });

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // Hook for navigation

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Fonction de soumission du formulaire
  const handleLogin: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data);
    router.push('/'); // Redirection après connexion
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left section */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 flex flex-col items-center justify-center border-r border-gray-400">
            <Image src="/Logo_Orion.jpg" alt="Logo" width={80} height={80} className="rounded-full mb-6" priority />
            <div className="text-center p-5">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">Bienvenue</h1>
              <p className="text-lg mb-6 text-gray-700">Connectez-vous pour accéder à toutes nos fonctionnalités et trouver les meilleures offres.</p>
              <p className="text-sm text-gray-600 opacity-75">www.votresite.com</p>
            </div>
          </div>

          {/* Right section */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Connexion</h2>
              <form onSubmit={handleSubmit(handleLogin)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                    <Input id="email" type="email" {...register('email')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400" placeholder="Votre email" />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-300">Mot de passe</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400 pr-10" placeholder="Mot de passe" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                      {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white focus:ring focus:ring-blue-500 transition duration-300">Se connecter</Button>
              </form>

              {/* Social Buttons */}
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-400">ou</span>
              </div>
              <div className="mt-4 space-y-2">
                <SocialButton Icon={() => <GoogleIcon />} text="Continuer avec Google" gradient="bg-gradient-to-r from-blue-300 to-green-400" />
                <SocialButton Icon={Facebook} text="Continuer avec Facebook" gradient="bg-gradient-to-r from-blue-600 to-blue-700" />
                <SocialButton Icon={Instagram} text="Continuer avec Instagram" gradient="bg-gradient-to-r from-pink-600 to-pink-700" />
              </div>

              <div className="mt-6 text-center">
                <small className="text-gray-400">Pas encore de compte ?{' '}
                  <Link href="/register" className="text-blue-300 hover:text-blue-200">S&apos;inscrire</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
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