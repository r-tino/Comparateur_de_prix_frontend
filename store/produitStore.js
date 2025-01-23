// store/produitStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:3001/produits';

const useProduitStore = create(
  persist(
    (set) => ({
      produitData: [],
      setProduitData: (data) => {
        if (Array.isArray(data)) {
          set(() => ({ produitData: data }));
        } else {
          console.warn('Les données des produits doivent être un tableau valide');
        }
      },
      fetchProduits: async (page = 1, limit = 10) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
              set({ produitData: responseData.data });
            } else {
              console.warn('La structure des données reçues de l\'API des produits est inattendue');
            }
          } else {
            throw new Error('Échec de la récupération des produits');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des produits:', error);
        }
      },
      addProduit: async (produitData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(produitData),
          });

          if (response.ok) {
            const newProduit = await response.json();
            set((state) => ({
              produitData: [...state.produitData, newProduit],
            }));
            return newProduit;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout du produit");
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout du produit:', error);
          throw error;
        }
      },
      updateProduit: async (id_Produit, updatedData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`${API_URL}/${id_Produit}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedProduit = await response.json();
            set((state) => ({
              produitData: state.produitData.map((produit) =>
                produit.id_Produit === id_Produit ? { ...produit, ...updatedProduit } : produit
              ),
            }));
            return updatedProduit;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour du produit");
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du produit:', error);
          throw error;
        }
      },
      deleteProduit: async (id_Produit) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`${API_URL}/${id_Produit}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              produitData: state.produitData.filter((produit) => produit.id_Produit !== id_Produit),
            }));
            return { message: 'Produit supprimé avec succès' };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression du produit");
          }
        } catch (error) {
          console.error('Erreur lors de la suppression du produit:', error);
          throw error;
        }
      },
    }),
    {
      name: 'produit-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ produitData: state.produitData }),
    }
  )
);

export default useProduitStore;