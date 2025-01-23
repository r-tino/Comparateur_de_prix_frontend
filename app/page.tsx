// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Percent, ShoppingBag, Bell, Zap, Gift, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useFetchProduit } from '../hooks/produit.hook.js';
import useFetchOffre from '../hooks/offre.hook.js';
import useFetchPromotion from '../hooks/promotion.hook.js';
import { useProduitStore, useOffreStore, usePromotionStore } from '../store';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Typing the product and offer
interface Product {
  id_Produit: string;
  nom_Produit: string;
  prixInitial: number;
  photos: { url: string }[];
  categorie: { nomCategorie: string };
  note_Produit: number;
}

interface Offer {
  id_Offre: string;
  prixOffre: number;
  produit: Product;
}

interface Promotion {
  id_Promotion: string;
  pourcentage: number;
  prixPromotionnel: number;
  offre: Offer;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const router = useRouter();
  
  // Utilisation des hooks pour mettre à jour les données
  useFetchProduit();
  useFetchOffre();
  useFetchPromotion();
  
  const produitData = useProduitStore((state) => state.produitData);
  const offreData = useOffreStore((state) => state.offreData);
  const promotionData = usePromotionStore((state) => state.promotionData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section with Search */}
      <motion.section 
        className="container mx-auto px-4 py-12 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Card className="bg-white/70 backdrop-filter backdrop-blur-lg rounded-3xl shadow-lg overflow-hidden border-0">
          <CardContent className="p-8 md:p-12">
            <motion.div {...fadeInUp}>
              <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center">
                Comparez et économisez
              </CardTitle>
              <CardDescription className="text-xl text-gray-600 mb-8 text-center">
                Trouvez les meilleures offres parmi des milliers de produits
              </CardDescription>
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full text-lg py-6 px-4 rounded-full bg-white/50 backdrop-filter backdrop-blur-sm border-0 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 border-0">
                  <Search className="mr-2 h-5 w-5" /> Rechercher
                </Button>
              </form>
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Main Content Tabs */}
      <section className="container mx-auto px-4 mb-12">
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="w-full justify-center mb-8 bg-transparent">
            <TabsTrigger value="trending" className="text-lg font-semibold px-6 py-3 bg-indigo-100/50 backdrop-filter backdrop-blur-sm rounded-full mx-1 border-0 transition-all duration-300 data-[state=active]:bg-indigo-200/70 data-[state=active]:text-indigo-800" onClick={() => setActiveTab('trending')}>
              <TrendingUp className="mr-2 h-5 w-5" /> Tendances
            </TabsTrigger>
            <TabsTrigger value="offers" className="text-lg font-semibold px-6 py-3 bg-indigo-100/50 backdrop-filter backdrop-blur-sm rounded-full mx-1 border-0 transition-all duration-300 data-[state=active]:bg-indigo-200/70 data-[state=active]:text-indigo-800" onClick={() => setActiveTab('offers')}>
              <Percent className="mr-2 h-5 w-5" /> Meilleures offres
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-lg font-semibold px-6 py-3 bg-indigo-100/50 backdrop-filter backdrop-blur-sm rounded-full mx-1 border-0 transition-all duration-300 data-[state=active]:bg-indigo-200/70 data-[state=active]:text-indigo-800" onClick={() => setActiveTab('categories')}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Catégories
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value={activeTab}>
              {activeTab === "trending" && (
                <motion.div
                  key="trending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {isLoading
                      ? Array(8).fill(0).map((_, index) => (
                          <Card key={index} className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-0">
                            <Skeleton className="w-full h-48" />
                            <CardContent className="p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                          </Card>
                        ))
                      : produitData.slice(0, 8).map((product: Product) => (
                          <motion.div
                            key={product.id_Produit}
                            whileHover={{ 
                              y: -10, 
                              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            onClick={() => router.push(`/products/${product.id_Produit}`)}
                            className="cursor-pointer"
                          >
                            <Card className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col border-0 transition-all duration-300 ease-in-out">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                <Image src={product.photos[0]?.url || '/images/product-placeholder.jpg'} alt={product.nom_Produit} width={300} height={200} priority className="w-full h-48 object-cover" />
                              </motion.div>
                              <CardContent className="p-4 flex-grow">
                                <p className="text-sm text-gray-600">{product.categorie.nomCategorie}</p>
                                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">{product.nom_Produit}</CardTitle>
                                {renderStars(product.note_Produit)}
                                <p className="text-sm text-gray-600 mt-2">À partir de</p>
                                <p className="text-xl font-bold text-indigo-600">{product.prixInitial.toLocaleString()} Ar</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "offers" && (
                <motion.div
                  key="offers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                      ? Array(6).fill(0).map((_, index) => (
                          <Card key={index} className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-0">
                            <Skeleton className="w-full h-56" />
                            <CardContent className="p-4">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                          </Card>
                        ))
                      : offreData.slice(0, 6).map((offre: Offer) => (
                          <motion.div
                            key={offre.id_Offre}
                            whileHover={{ 
                              y: -10, 
                              boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                              transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            onClick={() => router.push(`/products/${offre.produit.id_Produit}`)}
                            className="cursor-pointer"
                          >
                            <Card className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col border-0 transition-all duration-300 ease-in-out">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                              >
                                <div className="relative">
                                  <Image src={offre.produit.photos[0]?.url || '/images/product-placeholder.jpg'} alt={offre.produit.nom_Produit} width={400} height={300} priority className="w-full h-56 object-cover" />
                                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    Offre spéciale
                                  </div>
                                </div>
                              </motion.div>
                              <CardContent className="p-4 flex-grow">
                                <p className="text-sm text-gray-600">{offre.produit.categorie.nomCategorie}</p>
                                <CardTitle className="text-lg font-semibold text-gray-800 mb-2">{offre.produit.nom_Produit}</CardTitle>
                                {renderStars(offre.produit.note_Produit)}
                                <p className="text-sm text-gray-600 mt-2">À partir de</p>
                                <p className="text-xl font-bold text-green-600">{offre.prixOffre.toLocaleString()} Ar</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {['Électronique', 'Mode', 'Maison', 'Beauté', 'Sports', 'Livres', 'Jouets', 'Alimentation', 'Auto', 'Jardin', 'Santé', 'Bijoux'].map((category) => (
                      <motion.div
                        key={category}
                        whileHover={{ 
                          y: -5, 
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                          transition: { duration: 0.3, ease: "easeOut" }
                        }}
                      >
                        <Card className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col justify-center items-center p-6 cursor-pointer border-0 transition-all duration-300 ease-in-out">
                          <CardContent className="text-center">
                            <CardTitle className="text-lg font-semibold text-gray-800 mb-2">{category}</CardTitle>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </section>

      {/* Featured Deals Section */}
      <motion.section 
        className="container mx-auto px-4 py-12 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Deals du jour</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3).fill(0).map((_, index) => (
                <Card key={index} className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border-0">
                  <Skeleton className="w-full h-64" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))
            : promotionData.slice(0, 3).map((promotion: Promotion) => (
                <motion.div
                  key={promotion.id_Promotion}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  onClick={() => router.push(`/products/${promotion.offre.produit.id_Produit}`)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden h-full flex flex-col border-0 transition-all duration-300 ease-in-out">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="relative">
                        <Image src={promotion.offre.produit.photos[0]?.url || '/images/product-placeholder.jpg'} alt={promotion.offre.produit.nom_Produit} width={400} height={300} priority className="w-full h-64 object-cover" />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-3">
                          -{promotion.pourcentage}%
                        </div>
                      </div>
                    </motion.div>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="text-xl font-semibold text-gray-800 mb-2">{promotion.offre.produit.nom_Produit}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-4">
                        Économisez {promotion.pourcentage}% sur ce produit !
                      </CardDescription>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500 line-through">{promotion.offre.prixOffre.toLocaleString()} Ar</p>
                          <p className="text-2xl font-bold text-green-600">{promotion.prixPromotionnel.toLocaleString()} Ar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </motion.section>

      {/* Coming Soon Feature Preview */}
      <motion.section 
        className="container mx-auto px-4 py-16 mb--12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-3xl shadow-2xl overflow-hidden border-0">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <CardTitle className="text-3xl font-bold text-white mb-4">Fonctionnalités à venir</CardTitle>
              <CardDescription className="text-purple-100 mb-6">
                Nous travaillons sur de nouvelles fonctionnalités passionnantes pour améliorer votre expérience de comparaison de prix. Restez à l&apos;écoute pour les mises à jour !
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                <div className="bg-white/20 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <Bell className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Alertes de prix</h3>
                  <p className="text-sm">Soyez notifié lorsque les prix baissent</p>
                </div>
                <div className="bg-white/20 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <Zap className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Comparaison rapide</h3>
                  <p className="text-sm">Comparez instantanément les prix entre différents vendeurs</p>
                </div>
                <div className="bg-white/20 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <Gift className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Programme de fidélité</h3>
                  <p className="text-sm">Gagnez des points et obtenez des réductions exclusives</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
}

