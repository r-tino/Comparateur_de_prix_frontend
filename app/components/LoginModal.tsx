// app/components/LoginModal.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { Facebook, Instagram, Eye, EyeOff, X } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // État pour basculer entre connexion et inscription


  return (
    <div className="text-white p-0 rounded-md shadow-lg max-w-3xl w-full relative">
      {/* Icone pour fermer le modal */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-100" onClick={onClose}>
        <X size={24} />
      </button>

      <div className="flex flex-col md:flex-row gap-0">
        {/* Section de gauche - Dégradé gris doux */}
        <div className="w-full md:w-1/2 p-5 bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 relative flex flex-col items-center justify-center border-r border-gray-400">
          <div className="absolute top-5 left-5">
            <Image
              src="/Logo_Orion.jpg"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-full border border-gray-400"
              priority
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              {isRegister ? 'Inscription' : 'Bienvenue'}
            </h1>
            <p className="text-lg mb-6 text-gray-700">
            {isRegister
                ? 'Créez un compte pour accéder à toutes nos fonctionnalités et trouver les meilleures offres.'
                : 'Connectez-vous pour accéder à toutes nos fonctionnalités et trouver les meilleures offres.'}
            </p>
            <p className="text-sm opacity-75 text-gray-600">
              www.votresite.com
            </p>
          </div>
        </div>

        {/* Section de droite - Dégradé bleu nuit amélioré */}
        <div className="w-full md:w-1/2 p-5 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
          <h2 className="text-xl font-semibold mb-4 text-gray-200"> {isRegister ? 'Inscription' : 'Connexion'}</h2>
          <form>
            <div className="space-y-4">
              {isRegister && (
                  <>
                    {/* Champs supplémentaires pour l'inscription */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-gray-300">
                        Nom de l&apos;utilisateur
                      </Label>
                      <Input
                        id="username"
                        className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400"
                        placeholder="Nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-300">
                        Adresse de l&apos;utilisateur
                      </Label>
                      <Input
                        id="address"
                        className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400"
                        placeholder="Adresse"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-sm font-medium text-gray-300">
                        Contact de l&apos;utilisateur
                      </Label>
                      <Input
                        id="contact"
                        className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400"
                        placeholder="Numéro de téléphone"
                      />
                    </div>
                  </>
                )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400"
                  placeholder="exemple@exemple.com"
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="bg-gray-800 text-white border-gray-500 placeholder-gray-400 focus:border-blue-400 pr-10"
                    placeholder="8 caractères minimum"
                  />
                  {/* Icone pour voir/cacher le mot de passe, centré avec flex */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-300">
                    Type de compte
                  </Label>
                  <select
                    id="role"
                    className="w-full bg-gray-800 text-white border-gray-500 rounded-md p-2"
                  >
                    <option value="visiteur">Visiteur</option>
                    <option value="vendeur">Vendeur</option>
                  </select>
                </div>
              )}
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white focus:ring focus:ring-blue-500">
              {isRegister ? 'Créer un compte' : 'Se connecter'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-400">ou</span>
          </div>
          <div className="mt-4 space-y-2">
            {/* Bouton Google */}
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-grey-700 to-grey-800 text-white border-gray-500 hover:bg-gradient-to-l hover:from-blue-300 hover:to-green-400 flex items-center justify-center"
            >
              <svg className="mr-2 h-5 w-5 fill-current text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M44.5 20H24v8.5h11.8C34.8 32.2 30.2 35.5 24 35.5c-7 0-12.5-5.5-12.5-12.5S17 10.5 24 10.5c3.2 0 6.1 1.2 8.4 3.3l6.3-6.3C34.2 5 29.4 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.8 0 19.7-7.8 21-18h-8.5z" />
              </svg>
              Continuer avec Google
            </Button>
            {/* Bouton Facebook */}
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-gray-500 hover:bg-gradient-to-l hover:from-blue-700 hover:to-blue-800"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Continuer avec Facebook
            </Button>
            {/* Bouton Instagram */}
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white border-gray-500 hover:bg-gradient-to-l hover:from-pink-700 hover:to-pink-800"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Continuer avec Instagram
            </Button>
          </div>
          <div className="mt-4 text-center">
            <small className="text-gray-400">
              {isRegister ? 'Vous avez déjà un compte ?' : 'Vous n\'avez pas de compte ?'}{' '}
                <a
                  href="#"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-blue-300 hover:text-blue-200"
                >
                  {isRegister ? 'Se connecter' : 'S\'inscrire'}
                </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
