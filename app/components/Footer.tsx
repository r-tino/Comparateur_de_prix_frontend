// app/components/Footer.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, ArrowUp, ChevronRight, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/produits', label: 'Produits' },
  { href: '/offre', label: 'Offre' },
  { href: '/promotion', label: 'Promotion' },
];

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook, hoverColor: 'hover:text-blue-600' },
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter, hoverColor: 'hover:text-blue-400' },
  { href: 'https://instagram.com', label: 'Instagram', icon: Instagram, hoverColor: 'hover:text-pink-600' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    setEmail('');
    setError('');
    // Logique d'abonnement ici
  };
  
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 border-t border-gray-200 py-16 shadow-lg">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Section 1: Logo et description */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link href="/" className="flex items-center text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
              <Image src="/Logo_Orion.jpg" alt="Orion Logo" width={64} height={64} className="rounded-full mr-3 shadow-md" />
              <span className="relative">
                Orion Sarl
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100"></span>
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Votre plateforme de confiance pour la comparaison de prix à Madagascar. Trouvez les meilleures offres et faites des achats intelligents.
            </p>
          </motion.div>

          {/* Section 2: Liens de navigation */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Liens rapides</h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <motion.li key={item.href} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                  <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: Informations légales */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">À propos</h3>
            <ul className="space-y-3">
              {[
                { title: 'Conditions d\'utilisation', href: '/terms' },
                { title: 'Politique de confidentialité', href: '/privacy' },
                { title: 'Contactez-nous', href: '/contact' },
              ].map((item) => (
                <motion.li key={item.href} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
                  <Link href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                    <ChevronRight className="h-4 w-4 mr-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="relative">
                      {item.title}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100"></span>
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 4: Newsletter et réseaux sociaux */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Restez informé</h3>
            <form onSubmit={handleNewsletterSubmit} className="relative">
  <div className="relative flex items-center group">
    {/* Input */}
    <Input
      type="email"
      placeholder="Entrez votre email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full pl-6 pr-16 py-5 text-lg rounded-md border border-gray-300 bg-white/60 shadow-md 
      focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 
      transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg backdrop-blur-lg"
    />
    {/* Button */}
    <Button
      type="submit"
      className="absolute right-2 px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white 
      rounded-md shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      aria-label="Envoyer"
    >
      <Send className="h-5 w-5" />
    </Button>
  </div>

  {/* Error Message */}
  <AnimatePresence>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="text-red-500 text-sm pl-1 mt-2"
      >
        {error}
      </motion.p>
    )}
  </AnimatePresence>
</form>

            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Suivez-nous sur ${link.label}`}
                  className={`text-gray-400 ${link.hoverColor} transition-colors duration-200`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="h-6 w-6 shadow-sm" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600"
        >
          <p>&copy; {new Date().getFullYear()} Orion Sarl. Tous droits réservés.</p>
        </motion.div>
      </div>
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
            aria-label="Retour en haut"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

