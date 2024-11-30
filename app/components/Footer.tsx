// app/components/Footer.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Footer() {
  const [email] = useState('');
  const [error, setError] = useState('');
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    // Logique d'abonnement
  };
  
  // Exemple de validation simple
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <footer className="bg-night-blue text-gray-100 border-t border-gray-600">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Section 1: Logo et description */}
          <div>
            <Link href="/" className="flex items-center text-lg font-semibold text-white">
              <Image src="/Logo_Orion.jpg" alt="Orion Logo" width={48} height={48} className="mr-2" />
              Orion Prix
            </Link>
            <p className="mt-2 text-gray-400">
              Votre plateforme de comparaison de prix pour des achats intelligents à Madagascar.
            </p>
          </div>

          {/* Section 2: Liens de navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {['Accueil', 'Produits', 'Offres', 'Catégories', 'Historique des Prix'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-gray-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Informations légales */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">À propos</h3>
            <ul className="space-y-2">
              {[
                { title: 'Conditions d\'utilisation', href: '/terms' },
                { title: 'Politique de confidentialité', href: '/privacy' },
                { title: 'Contactez-nous', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-gray-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Newsletter et réseaux sociaux */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Restez informé</h3>
            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-grow bg-gray-800 text-gray-200 placeholder-gray-500 border-gray-600 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">S&apos;abonner</Button>
              </div>
            </form>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" aria-label="Suivez-nous sur Facebook" className="text-gray-400 hover:text-blue-500">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com" target="_blank" aria-label="Suivez-nous sur Twitter" className="text-gray-400 hover:text-blue-400">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Suivez-nous sur Instagram" className="text-gray-400 hover:text-pink-600">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-600 text-center text-gray-200">
          <p>&copy; {new Date().getFullYear()} Orion Prix. Tous droits réservés.</p>
        </div>
      </div>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-4 text-gray-400 hover:text-gray-200">
        Retour en haut
      </button>

    </footer>
  )
}