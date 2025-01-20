/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, Info, ArrowLeft, Check, Shield, Truck, Clock } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import { Product, Offer, BreadcrumbItem } from '@/types/produit';
import { useRouter } from 'next/navigation';

// Update the price history data type
const priceHistoryData = [
    { date: '1 jan', price: 1350 },
    { date: '15 jan', price: 1350 },
    { date: '1 fév', price: 1300 },
    { date: '15 fév', price: 1260 },
    { date: '1 mar', price: 1260 },
    { date: '15 mar', price: 1220 },
    { date: '1 avr', price: 1200 },
    { date: '15 avr', price: 1200 },
    { date: '1 mai', price: 1170 },
    { date: '15 mai', price: 1150 },
    { date: '1 juin', price: 1100 },
    { date: '15 juin', price: 1080 },
  ];

// Technical specifications for the product
const specifications = {
  display: {
    size: "6.1 pouces",
    type: "Super Retina XDR OLED",
    resolution: "2556 x 1179 pixels",
    features: ["ProMotion", "Always-On", "HDR"]
  },
  camera: {
    main: "48 MP (principal)",
    ultra: "12 MP (ultra grand-angle)",
    tele: "12 MP (téléobjectif)",
    front: "12 MP TrueDepth"
  },
  performance: {
    processor: "A16 Bionic",
    ram: "6 Go",
    storage: ["128 Go", "256 Go", "512 Go", "1 To"]
  },
  battery: {
    capacity: "3200 mAh",
    charging: ["MagSafe", "Qi sans fil", "Lightning"]
  }
};

// Seller Modal Component
function SellerModal({ seller }: { seller: Offer }) {
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
          src={seller.vendeur.logo || '/placeholder.svg'}
          alt={seller.vendeur.nom_Vendeur}
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
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span>Vendeur vérifié</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-500" />
          <span>Garantie vendeur</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-purple-500" />
          <span>Livraison gratuite</span>
        </div>
      </div>
      <div className="grid gap-2 text-sm mt-4">
        <p><strong>Adresse:</strong> {seller.vendeur.adresse_Vendeur}</p>
        <p><strong>Contact:</strong> {seller.vendeur.telephone_Vendeur}</p>
        <p><strong>Email:</strong> {seller.vendeur.email_Vendeur}</p>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold text-green-600">{seller.prixOffre.toFixed(2)} €</p>
        <p className="text-sm text-muted-foreground">Stock disponible: {seller.quantite_Offre} unités</p>
      </div>
    </motion.div>
  );
}

// Breadcrumb Component
function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
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

// Main Component
export default function ProductDetails({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  // Updated product data with more details
  const product: Product = {
    id_Produit: params.id,
    nom_Produit: "iPhone 14 Pro",
    description: "Le dernier iPhone avec une puce A16 Bionic, un appareil photo de 48MP et Dynamic Island. Découvrez une expérience photographique révolutionnaire et des performances exceptionnelles.",
    prixInitial: 999,
    marque: "Apple",
    note_Produit: 4.8,
    photos: [
      { url: "/images/iphone14pro-1.jpg" },
      { url: "/images/iphone14pro-2.jpg" },
      { url: "/images/iphone14pro-3.jpg" },
      { url: "/images/iphone14pro-4.jpg" }
    ],
    categorie: "Smartphones",
    contenu: "1 x iPhone 14 Pro, 1 x Câble USB-C vers Lightning, Documentation",
    groupe_cible: "Professionnels, Passionnés de technologie, Photographes",
    caracteristiques: [
      "Écran Super Retina XDR avec ProMotion",
      "Puce A16 Bionic avec Neural Engine",
      "Système photo pro 48 Mpx",
      "Dynamic Island",
      "Face ID",
      "5G capable"
    ]
  };

  // Updated product offers with more details
  const productOffers: Offer[] = [
    {
      id_Offre: "1",
      produit: product,
      vendeur: {
        nom_Vendeur: "Apple Store",
        note_Vendeur: 4.9,
        logo: "/images/apple-logo.png",
        adresse_Vendeur: "1 Infinite Loop, Cupertino, CA 95014, États-Unis",
        telephone_Vendeur: "+1 800-692-7753",
        email_Vendeur: "contact@apple.com",
      },
      prixOffre: 999,
      quantite_Offre: 100,
    },
    {
      id_Offre: "2",
      produit: product,
      vendeur: {
        nom_Vendeur: "Amazon",
        note_Vendeur: 4.7,
        logo: "/images/amazon-logo.png",
        adresse_Vendeur: "410 Terry Ave N, Seattle, WA 98109, États-Unis",
        telephone_Vendeur: "+1 888-280-4331",
        email_Vendeur: "cs-reply@amazon.com",
      },
      prixOffre: 989,
      quantite_Offre: 50,
    },
    {
      id_Offre: "3",
      produit: product,
      vendeur: {
        nom_Vendeur: "Best Buy",
        note_Vendeur: 4.5,
        logo: "/images/bestbuy-logo.png",
        adresse_Vendeur: "7601 Penn Ave S, Richfield, MN 55423, États-Unis",
        telephone_Vendeur: "+1 888-237-8289",
        email_Vendeur: "support@bestbuy.com",
      },
      prixOffre: 979,
      quantite_Offre: 30,
    },
    {
      id_Offre: "4",
      produit: product,
      vendeur: {
        nom_Vendeur: "Fnac",
        note_Vendeur: 4.6,
        logo: "/images/fnac-logo.png",
        adresse_Vendeur: "9 rue des Bateaux-Lavoirs, 94200 Ivry-sur-Seine, France",
        telephone_Vendeur: "0892 35 04 05",
        email_Vendeur: "contact@fnac.com",
      },
      prixOffre: 995,
      quantite_Offre: 25,
    }
  ];

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
    { label: 'Smartphones', href: '/products/smartphones' },
    { label: product.nom_Produit, href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pb-16">
      <div className="container mx-auto px-4 py-8">
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
          className="grid gap-8"
        >
          {/* Product Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            {/* Product Images - Reduced size */}
            <div className="w-full lg:w-2/5">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-lg overflow-hidden shadow-xl bg-white"
              >
                <Image
                  src={product.photos[activeImage]?.url || '/placeholder.svg'}
                  alt={product.nom_Produit}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg p-4"
                />
              </motion.div>
              <div className="flex mt-4 gap-2 overflow-x-auto pb-2">
                {product.photos.map((photo, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden bg-white ${
                      index === activeImage ? 'ring-2 ring-primary' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={photo.url || '/placeholder.svg'}
                      alt={`${product.nom_Produit} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-3/5">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <motion.div 
                  className="flex items-center gap-2 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Badge variant="secondary">{product.categorie}</Badge>
                  <Badge variant="outline">{product.marque}</Badge>
                </motion.div>

                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {product.nom_Produit}
                </motion.h1>

                <motion.div 
                  className="flex items-center gap-2 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{product.note_Produit}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (Plus de 1000 avis)
                  </span>
                </motion.div>

                <motion.p 
                  className="text-lg text-muted-foreground mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {product.description}
                </motion.p>

                <motion.div 
                  className="bg-primary/5 rounded-lg p-6 mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-muted-foreground mb-2">Meilleur prix actuel</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-primary">
                      {Math.min(...productOffers.map(offer => offer.prixOffre)).toFixed(2)} €
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      chez {productOffers.find(offer => 
                        offer.prixOffre === Math.min(...productOffers.map(offer => offer.prixOffre))
                      )?.vendeur.nom_Vendeur}
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {product.caracteristiques.map((feature: string, index: number) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="info" className="w-full mt-8">
            <TabsList className="w-full justify-start border-b pb-0">
              <TabsTrigger value="info">Spécifications</TabsTrigger>
              <TabsTrigger value="offers">Offres ({productOffers.length})</TabsTrigger>
              <TabsTrigger value="history">Historique des prix</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-8">
                    {Object.entries(specifications).map(([category, specs], index) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(specs).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-muted-foreground capitalize">{key}</p>
                              <p className="font-medium">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="offers" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <AnimatePresence>
                    {productOffers.map((offer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors duration-200 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12">
                              <Image
                                src={offer.vendeur.logo || '/placeholder.svg'}
                                alt={offer.vendeur.nom_Vendeur}
                                layout="fill"
                                objectFit="contain"
                                className="rounded"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{offer.vendeur.nom_Vendeur}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1">{offer.vendeur.note_Vendeur}/5</span>
                                <span className="ml-2">({offer.quantite_Offre} en stock)</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">{offer.prixOffre.toFixed(2)} €</p>
                              <p className="text-sm text-muted-foreground">Livraison gratuite</p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Plus d&apos;infos
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
                <Card className="bg-white">
                    <CardContent className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Historique des prix</h3>
                        <p className="text-sm text-muted-foreground">
                        Évolution du prix le plus bas au fil du temps. Les frais de livraison ne sont pas inclus.
                        </p>
                    </div>
                    
                    <div className="relative h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                            data={priceHistoryData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false}
                            stroke="#E5E7EB"
                            />
                            <XAxis 
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            />
                            <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            domain={[1080, 1350]}
                            ticks={[1080, 1170, 1260, 1350]}
                            />
                            <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white border rounded-lg shadow-lg p-2">
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-sm text-blue-600 font-bold">
                                        {payload[0].value} €
                                    </p>
                                    </div>
                                );
                                }
                                return null;
                            }}
                            />
                            <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#2563EB" }}
                            />
                        </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Prix le plus bas 6 mois</p>
                        </div>
                        <p className="text-lg font-bold">999,00 €</p>
                        <p className="text-sm text-gray-500">15 juin 2023</p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Prix moyen</p>
                        </div>
                        <p className="text-lg font-bold">1149,00 €</p>
                        <p className="text-sm text-gray-500">Sur 6 mois</p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-500">Prix le plus bas maintenant</p>
                        </div>
                        <p className="text-lg font-bold">979,00 €</p>
                        <p className="text-sm text-blue-600">Best Buy</p>
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

