// app/products/[id]/page.tsx

'use client';

import React, { useState } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, Info, ArrowLeft } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
import { ChartContainer } from "@/components/ui/chart"
import { useAuthStore } from '../../../store/store.js';
import useFetchProduit from '../../../hooks/produit.hook.js';
import useFetchOffre from '../../../hooks/offre.hook.js';
import useFetchPromotion from '../../../hooks/promotion.hook.js';
import { Product, Offer, BreadcrumbItem } from '@/types/produit.jsx';
import { useRouter } from 'next/navigation';

// Sample price history data
const priceHistoryData = [
  { date: '4 oct', price: 28 },
  { date: '11 oct', price: 25 },
  { date: '18 oct', price: 25 },
  { date: '25 oct', price: 26 },
  { date: '1 nov', price: 25 },
  { date: '8 nov', price: 25 },
  { date: '15 nov', price: 23 },
  { date: '22 nov', price: 28 },
  { date: '29 nov', price: 30 },
  { date: '6 déc', price: 32 },
  { date: '13 déc', price: 34.99 },
  { date: '20 déc', price: 34.99 },
];

interface SellerModalProps {
  seller: Offer;
}

function SellerModal({ seller }: SellerModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid gap-4"
    >
      <div className="flex items-center gap-4">
        <Image
          src={seller.produit.photos[0]?.url || '/placeholder.svg'}
          alt={seller.produit.nom_Produit}
          width={60}
          height={60}
          className="rounded-lg"
        />
        <div>
          <h3 className="font-semibold">{seller.vendeur.nom_Vendeur}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1">{seller.vendeur.note_Vendeur}/5</span>
          </div>
        </div>
      </div>
      <div className="grid gap-2 text-sm">
        <p><strong>Adresse:</strong> {seller.vendeur.adresse_Vendeur}</p>
        <p><strong>Contact:</strong> {seller.vendeur.telephone_Vendeur}</p>
        <p><strong>Email:</strong> {seller.vendeur.email_Vendeur}</p>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold text-green-600">{seller.prixOffre.toFixed(2)} €</p>
      </div>
    </motion.div>
  );
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          <a href={item.href} className="hover:text-foreground transition-colors duration-200">
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}

interface ProductDetailsProps {
  params: {
    id: string;
  };
}

interface Photo {
  url: string;
}

export default function ProductDetails({ params }: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  useFetchProduit();
  useFetchOffre();
  useFetchPromotion();
  const produitData = useAuthStore((state) => state.produitData);
  const offreData = useAuthStore((state) => state.offreData);

  const product = produitData.find((p: Product) => p.id_Produit === params.id);
  const productOffers = offreData.filter((o: Offer) => o.produit.id_Produit === params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">Produit non trouvé</p>
      </div>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Accueil', href: '/' },
    { label: 'Produits', href: '/products' },
    { label: product.nom_Produit, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            className="mb-4 hover:bg-blue-100 transition-colors duration-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <Breadcrumb items={breadcrumbItems} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="w-full lg:w-1/3">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-xl"
              >
                <Image
                  src={product.photos[activeImage]?.url || '/placeholder.svg'}
                  alt={product.nom_Produit}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </motion.div>
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {product.photos.map((photo: Photo, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden ${
                      index === activeImage ? 'ring-2 ring-primary' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={photo.url || '/placeholder.svg'}
                      alt={`${product.nom_Produit} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {product.nom_Produit}
              </motion.h1>
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-muted-foreground">Classe {product.note_Produit}</span>
              </motion.div>
              <motion.p 
                className="text-lg text-muted-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {product.description}
              </motion.p>
              <motion.div 
                className="bg-white/30 backdrop-filter backdrop-blur-lg rounded-lg p-6 mb-6 shadow-lg border border-white/50"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-sm text-muted-foreground">Prix actuel</p>
                <p className="text-4xl lg:text-5xl font-bold text-primary mt-2">{product.prixInitial.toFixed(2)} €</p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white/30 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-md border border-white/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-muted-foreground">Marque</p>
                  <p className="font-semibold">{product.marque}</p>
                </motion.div>
                <motion.div 
                  className="bg-white/30 backdrop-filter backdrop-blur-lg rounded-lg p-4 shadow-md border border-white/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <p className="font-semibold">{product.categorie.nomCategorie}</p>
                </motion.div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="w-full mt-8">
            <TabsList className="w-full justify-start border-b pb-0">
              <TabsTrigger value="info" className="text-sm font-medium">Info produit</TabsTrigger>
              <TabsTrigger value="offers" className="text-sm font-medium">Offres</TabsTrigger>
              <TabsTrigger value="history" className="text-sm font-medium">Historique des prix</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card className="bg-white/30 backdrop-filter backdrop-blur-lg border border-white/50">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Informations de base</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Nom du produit</p>
                          <p className="font-medium">{product.nom_Produit}</p>
                        </div>
                        <div className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Marque</p>
                          <p className="font-medium">{product.marque}</p>
                        </div>
                        <div className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Catégorie</p>
                          <p className="font-medium">{product.categorie.nomCategorie}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Général</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Contenu</p>
                          <p className="font-medium">{product.contenu}</p>
                        </div>
                        <div className="bg-white/50 backdrop-filter backdrop-blur-sm rounded-lg p-4">
                          <p className="text-sm text-muted-foreground">Groupe ciblé</p>
                          <p className="font-medium">{product.groupe_cible}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers" className="mt-6">
              <Card className="bg-white/30 backdrop-filter backdrop-blur-lg border border-white/50">
                <CardContent className="p-6">
                  <AnimatePresence>
                    {productOffers.map((offer: Offer, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors duration-200 mb-4 shadow-md bg-white/50 backdrop-filter backdrop-blur-sm">
                          <div className="flex items-center gap-4">
                            <Image
                              src={offer.vendeur.logo || '/placeholder.svg'}
                              alt={offer.vendeur.nom_Vendeur}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <div>
                              <p className="font-medium">{offer.produit.nom_Produit}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1">{offer.vendeur.note_Vendeur}/5</span>
                                <span className="ml-2">({offer.quantite_Offre})</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-xl font-bold text-primary">{offer.prixOffre.toFixed(2)} €</p>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Info className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Détails du vendeur</DialogTitle>
                                </DialogHeader>
                                <SellerModal seller={offer} />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card className="bg-white/30 backdrop-filter backdrop-blur-lg border border-white/50">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Historique des prix</h3>
                    <p className="text-sm text-muted-foreground">
                      Affiche le prix le plus bas au fil du temps. Les frais de livraison et les produits d&apos;occasion ne sont pas inclus.
                    </p>
                  </div>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        price: {
                          label: "Prix",
                          color: "hsl(var(--primary))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistoryData}>
                          <XAxis dataKey="date" />
                          <YAxis domain={['auto', 'auto']} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 border rounded-lg bg-white/50 backdrop-filter backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground">Prix le plus bas 3 mois</p>
                      <p className="text-xl font-bold">23,00 €</p>
                      <p className="text-sm text-muted-foreground">12 nov 2024</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-white/50 backdrop-filter backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground">Prix le plus bas maintenant</p>
                      <p className="text-xl font-bold">{product.prixInitial.toFixed(2)} €</p>
                      <p className="text-sm text-primary">Lego</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

