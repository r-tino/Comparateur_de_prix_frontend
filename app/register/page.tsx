// app/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Facebook, Instagram } from 'lucide-react';
import { SocialButton } from "@/components/SocialButton";
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../../services/auth'; // Assurez-vous d'importer registerUser

// Schéma de validation Zod
const registerSchema = z
  .object({
    username: z.string().min(1, 'Nom requis'),
    address: z.string().min(1, 'Adresse requise'),
    contact: z.string().regex(/^\d{10}$/, 'Numéro de téléphone invalide (10 chiffres)'),
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, 'Mot de passe : 8 caractères minimum')
      .regex(/[A-Z]/, 'Doit contenir au moins une lettre majuscule')
      .regex(/[a-z]/, 'Doit contenir au moins une lettre minuscule')
      .regex(/\d/, 'Doit contenir au moins un chiffre')
      .regex(/[@$!%*?&#]/, 'Doit contenir au moins un caractère spécial'),
    confirmPassword: z.string().min(8, 'Confirmation requise'),
    role: z.enum(['Visiteur', 'Vendeur'], {
      invalid_type_error: 'Type de compte invalide',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // Où afficher l'erreur
    message: 'Les mots de passe doivent correspondre',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      const result = await registerUser(data);
      if (result && result.message === 'Utilisateur créé avec succès') {
        alert(result.message);
        router.push('/login'); // Redirection après inscription
      } else {
        throw new Error(result?.message || 'Erreur inconnue');
      }
    } catch (error: unknown) {
      console.error('Erreur lors de l\'inscription:', error);
      if (error instanceof Error) {
        alert(`Inscription échouée : ${error.message}`);
      } else {
        alert('Inscription échouée : Erreur inconnue');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Section gauche */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 flex flex-col items-center justify-center border-r border-gray-400">
            <Image src="/Logo_Orion.jpg" alt="Logo" width={80} height={80} className="rounded-full mb-6" priority />
            <div className="text-center p-5">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">Inscription</h1>
              <p className="text-lg mb-6 text-gray-700">Créez un compte pour accéder à toutes nos fonctionnalités.</p>
              <p className="text-sm text-gray-600 opacity-75">www.votresite.com</p>
            </div>
          </div>

          {/* Section droite */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Inscription</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-300">Nom d&apos;utilisateur</Label>
                    <Input id="username" {...register('username')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400" placeholder="Votre nom" />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-300">Adresse</Label>
                    <Input id="address" {...register('address')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400" placeholder="Votre adresse" />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sm font-medium text-gray-300">Contact</Label>
                    <Input id="contact" {...register('contact')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400" placeholder="Votre numéro" />
                    {errors.contact && <p className="text-red-500 text-xs">{errors.contact.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                    <Input id="email" type="email" {...register('email')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400" placeholder="Votre email" />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-300">Mot de passe</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400 pr-10" placeholder="Mot de passe" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Confirmez le mot de passe</Label>
                    <div className="relative">
                      <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} {...register('confirmPassword')} className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400 pr-10" placeholder="Confirmez" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-300">Type de compte</Label>
                    <select id="role" {...register('role')} className="w-full input bg-gray-800 text-white border-gray-500 rounded-md p-2">
                      <option value="Visiteur">Visiteur</option>
                      <option value="Vendeur">Vendeur</option>
                    </select>
                    {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white focus:ring focus:ring-blue-500 transition duration-300">S&apos;inscrire</Button>
              </form>

              {/* Boutons sociaux */}
              <div className="mt-3 text-center">
                <span className="text-sm text-gray-400">ou</span>
              </div>
              <div className="mt-4 space-y-2">
                <SocialButton Icon={() => <GoogleIcon />} text="Continuer avec Google" gradient="bg-gradient-to-r from-blue-300 to-green-400" />
                <SocialButton Icon={Facebook} text="Continuer avec Facebook" gradient="bg-gradient-to-r from-blue-600 to-blue-700" />
                <SocialButton Icon={Instagram} text="Continuer avec Instagram" gradient="bg-gradient-to-r from-pink-600 to-pink-700" />
              </div>

              {/* Redirection vers la connexion */}
              <div className="mt-6 text-center">
                <small className="text-gray-400">Vous avez déjà un compte ? {' '}
                  <Link href="/login" className="text-blue-300 hover:text-blue-200">Se connecter</Link>
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