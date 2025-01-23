// store/promotionStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePromotionStore = create(
  persist(
    (set) => ({
      promotionData: [],
      setPromotionData: (data) => {
        if (Array.isArray(data)) {
          set(() => ({ promotionData: data }));
        } else {
          console.warn('Les données des promotions doivent être un tableau valide');
        }
      },
      fetchPromotions: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/promotions', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
              set({ promotionData: responseData.data });
            } else {
              console.warn('La structure des données reçues de l\'API des promotions est inattendue');
            }
          } else {
            throw new Error('Échec de la récupération des promotions');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des promotions:', error);
        }
      },
      addPromotion: async (promotionData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/promotions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(promotionData),
          });

          if (response.ok) {
            const newPromotion = await response.json();
            set((state) => ({
              promotionData: [...state.promotionData, newPromotion],
            }));
            return newPromotion;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout de la promotion");
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la promotion:', error);
          throw error;
        }
      },
      updatePromotion: async (id_Promotion, updatedData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/promotions/${id_Promotion}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedPromotion = await response.json();
            set((state) => ({
              promotionData: state.promotionData.map((promotion) =>
                promotion.id_Promotion === id_Promotion ? { ...promotion, ...updatedPromotion } : promotion
              ),
            }));
            return updatedPromotion;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de la promotion");
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la promotion:', error);
          throw error;
        }
      },
      deletePromotion: async (id_Promotion) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/promotions/${id_Promotion}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              promotionData: state.promotionData.filter((promotion) => promotion.id_Promotion !== id_Promotion),
            }));
            return { message: 'Promotion supprimée avec succès' };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression de la promotion");
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la promotion:', error);
          throw error;
        }
      },
    }),
    {
      name: 'promotion-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ promotionData: state.promotionData }),
    }
  )
);

export default usePromotionStore;