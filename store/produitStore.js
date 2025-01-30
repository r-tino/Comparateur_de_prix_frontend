// store/produitStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uploadImageToCloudinary } from '../hooks/produit.hook';

const API_URL = "http://localhost:3001/produits";

const useProduitStore = create(
  persist(
    (set) => ({
      produitData: [],
      totalProduits: 0,
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      error: null,

      setProduitData: (data) => {
        if (Array.isArray(data)) {
          set({ produitData: data });
        } else {
          console.warn("Les données des produits doivent être un tableau valide");
        }
      },

      fetchProduits: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log("Réponse de l'API:", responseData); // Ajoutez cette ligne pour vérifier la réponse

            if (responseData.success && Array.isArray(responseData.data.data)) {
              set({
                produitData: responseData.data.data,
                totalProduits: responseData.data.total,
                currentPage: page,
                totalPages: responseData.data.pageCount,
                isLoading: false,
              });
            } else {
              throw new Error("La structure des données reçues de l'API des produits est inattendue");
            }
          } else {
            throw new Error("Échec de la récupération des produits");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des produits:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      addProduit: async (produitData) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token non disponible");

          // Téléchargement des images sur Cloudinary et obtention des URLs
          const imageUrls = await Promise.all(
            produitData.photos.map(async (photo) => {
              if (photo.file instanceof File) {
                return await uploadImageToCloudinary(photo.file);
              }
              return photo.url;
            })
          );

          // Mise à jour des données du produit avec les URLs des images
          produitData.photos = imageUrls.map((url, index) => ({
            url,
            couverture: produitData.photos[index].couverture || false,
          }));

          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(produitData),
          });

          if (response.ok) {
            const newProduit = await response.json();
            if (newProduit.success) {
              set((state) => ({
                produitData: [...state.produitData, newProduit.data.produit],
                isLoading: false,
              }));
              return newProduit.data.produit;
            } else {
              throw new Error(newProduit.error || "Erreur lors de l'ajout du produit");
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout du produit");
          }
        } catch (error) {
          console.error("Erreur lors de l'ajout du produit:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateProduit: async (id_Produit, updatedData) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token non disponible");

          // Téléchargement des nouvelles images sur Cloudinary et obtention des URLs
          const imageUrls = await Promise.all(
            updatedData.photos.map(async (photo) => {
              if (photo.file instanceof File) {
                return await uploadImageToCloudinary(photo.file);
              }
              return photo.url;
            })
          );

          // Mise à jour des données du produit avec les URLs des images
          updatedData.photos = imageUrls.map((url, index) => ({
            url,
            couverture: updatedData.photos[index].couverture || false,
          }));

          const response = await fetch(`${API_URL}/${id_Produit}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedProduit = await response.json();
            if (updatedProduit.success) {
              set((state) => ({
                produitData: state.produitData.map((produit) =>
                  produit.id_Produit === id_Produit ? { ...produit, ...updatedProduit.data.produit } : produit
                ),
                isLoading: false,
              }));
              return updatedProduit.data.produit;
            } else {
              throw new Error(updatedProduit.error || "Erreur lors de la mise à jour du produit");
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour du produit");
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour du produit:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteProduit: async (id_Produit) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`${API_URL}/${id_Produit}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              set((state) => ({
                produitData: state.produitData.filter((produit) => produit.id_Produit !== id_Produit),
                isLoading: false,
              }));
              return { message: "Produit supprimé avec succès" };
            } else {
              throw new Error(result.error || "Erreur lors de la suppression du produit");
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression du produit");
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du produit:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "produit-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({ produitData: state.produitData }),
    }
  )
);

export default useProduitStore;