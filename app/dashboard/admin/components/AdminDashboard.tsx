// app/dashboard/admin/components/AdminDashboard.tsx

"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserStatsChart } from "./UserStatsChart";
import { CategoryChart } from "./CategoryChart";
import { ActivityTable } from "./ActivityTable";
import { Bell, Box, ShoppingBag, Gift, Grid, TrendingDown, TrendingUp } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import useFetchCategorie from "@/hooks/categorie.hook";
import useFetchOffre from "@/hooks/offre.hook";
import { useFetchProduit } from "@/hooks/produit.hook";
import useFetchPromotion from "@/hooks/promotion.hook";
import { useCategorieStore, useOffreStore, useProduitStore, usePromotionStore } from "@/store";
import { NotificationsDialog } from "./NotificationsDialog";

const MotionCard = motion(Card);

interface Categorie {
  nom: string;
  total: number;
}

export function AdminDashboard() {
  const [categorieState] = useFetchCategorie();
  const [offreState] = useFetchOffre();
  const [produitState] = useFetchProduit();
  const [promotionState] = useFetchPromotion();

  const categorieData = useCategorieStore((state) => state.categorieData);
  const offreData = useOffreStore((state) => state.offreData);
  const produitData = useProduitStore((state) => state.produitData);
  const promotionData = usePromotionStore((state) => state.promotionData);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const statCards = [
    { 
      title: "Produits Actifs", 
      data: produitData.length, 
      isLoading: produitState.isLoading, 
      icon: Box, 
      gradient: "from-blue-500 to-blue-700", 
      iconBg: "bg-blue-600",
      trend: { direction: "up", value: "12.3%", text: "+45 aujourd'hui" } 
    },
    { 
      title: "Offres Actives", 
      data: offreData.length, 
      isLoading: offreState.isLoading, 
      icon: ShoppingBag, 
      gradient: "from-green-500 to-green-700", 
      iconBg: "bg-green-600",
      trend: { direction: "up", value: "20.1%", text: "+15 nouveaux" } 
    },
    { 
      title: "Promotions Actives", 
      data: promotionData.length, 
      isLoading: promotionState.isLoading, 
      icon: Gift, 
      gradient: "from-orange-500 to-orange-700", 
      iconBg: "bg-orange-600",
      trend: { direction: "down", value: "5.6%", text: "-2 expirées" } 
    },
    { 
      title: "Catégories Actives", 
      data: categorieData.length, 
      isLoading: categorieState.isLoading, 
      icon: Grid, 
      gradient: "from-blue-400 to-blue-600", 
      iconBg: "bg-blue-500",
      trend: { direction: "up", value: "1.3%", text: "+34 aujourd'hui" } 
    },
  ];

  const notifications = [
    { id: 1, message: "Nouvelle commande reçue", read: false },
    { id: 2, message: "Mise à jour du stock nécessaire", read: false },
    { id: 3, message: "Révision des prix recommandée", read: true },
  ];

  const handleMarkAsRead = (id: number) => {
    // Implement the logic to mark a notification as read
    console.log(`Marked notification ${id} as read`);
  };

  // Formater les données pour UserStatsChart
  const userStatsData = [
    { name: "Produits", total: produitData.length, actifs: produitData.length, inactifs: 0 },
    { name: "Offres", total: offreData.length, actifs: offreData.length, inactifs: 0 },
    { name: "Promotions", total: promotionData.length, actifs: promotionData.length, inactifs: 0 },
    { name: "Catégories", total: categorieData.length, actifs: categorieData.length, inactifs: 0 },
  ];

  // Formater les données pour CategoryChart
  const categoryChartData = categorieData.map((categorie: Categorie) => ({
    nom_categorie: categorie.nom,
    total: categorie.total,
  }));

  // Ajoutez des logs pour vérifier les données
  useEffect(() => {
    console.log("Formatted categoryChartData:", categoryChartData);
  }, [categoryChartData]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 rounded-3xl shadow-2xl"
    >
      <motion.div 
        className="flex flex-col md:flex-row items-start md:items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-600 to-orange-600">
            Tableau de bord
          </h1>
          <p className="text-sm text-gray-600 mt-1">Aperçu de votre boutique</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="mt-4 md:mt-0"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <Bell className="h-4 w-4" />
        </Button>
      </motion.div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence>
          {statCards.map((card, index) => (
            <MotionCard
              key={card.title}
              className={`bg-gradient-to-br ${card.gradient} text-white backdrop-filter backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden`}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
              onHoverStart={() => setHoveredCard(card.title)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <CardContent className="p-6 relative">
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-10"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <card.icon className="w-full h-full" />
                </motion.div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-full ${card.iconBg} bg-opacity-20 flex items-center justify-center`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: hoveredCard === card.title ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-xs font-medium ${card.trend.direction === 'up' ? 'text-green-300' : 'text-red-300'}`}
                  >
                    {card.trend.direction === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <div className="text-3xl font-bold">
                  {card.isLoading ? <ClipLoader size={35} color={"#ffffff"} /> : card.data}
                </div>
                <div className="flex items-center text-sm mt-2">
                  <span className={`${card.trend.direction === 'up' ? 'text-green-300' : 'text-red-300'} font-medium mr-1`}>
                    {card.trend.value}
                  </span>
                  <span className="text-white/80">{card.trend.text}</span>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <MotionCard 
          className="lg:col-span-4 bg-white/90 backdrop-filter backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Statistiques Générales</h2>
            </div>
            <UserStatsChart data={userStatsData} />
          </CardContent>
        </MotionCard>
        <MotionCard 
          className="lg:col-span-3 bg-white/90 backdrop-filter backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Répartition des Catégories</h2>
            </div>
            <CategoryChart data={categoryChartData} />
          </CardContent>
        </MotionCard>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <MotionCard 
          className="lg:col-span-4 bg-white/90 backdrop-filter backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Activités Récentes</h2>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                24h
              </Button>
            </div>
            <ActivityTable />
          </CardContent>
        </MotionCard>
      </div>

      <NotificationsDialog
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
      />
    </motion.div>
  );
}