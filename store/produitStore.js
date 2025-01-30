// store/produitStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
          set(() => ({ produitData: data }));
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

          // Assurez-vous que les valeurs nécessaires sont présentes
          if (!produitData.nom_Produit || !produitData.description || produitData.prixInitial === undefined || produitData.stock === undefined || !produitData.categorieId) {
            throw new Error("Les champs requis sont manquants.");
          }

          const formData = new FormData();
          formData.append('nom_Produit', produitData.nom_Produit);
          formData.append('description', produitData.description);
          formData.append('prixInitial', produitData.prixInitial.toString()); // Convertir en chaîne
          formData.append('stock', produitData.stock.toString()); // Convertir en chaîne
          formData.append('categorieId', produitData.categorieId || '');
          formData.append('valeursAttributs', JSON.stringify(produitData.valeursAttributs || {}));
          formData.append('disponibilite', produitData.disponibilite ? 'true' : 'false'); // Convertir en chaîne

          produitData.photos.forEach((photo, index) => {
            formData.append(`photos[${index}][url]`, photo.url); // Assurez-vous que l'URL est une chaîne
            formData.append(`photos[${index}][couverture]`, photo.couverture ? 'true' : 'false'); // Convertir en chaîne
          });

          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
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

          const formData = new FormData();
          formData.append('nom_Produit', updatedData.nom_Produit);
          formData.append('description', updatedData.description);
          formData.append('prixInitial', updatedData.prixInitial.toString()); // Convertir en chaîne
          formData.append('stock', updatedData.stock.toString()); // Convertir en chaîne
          formData.append('categorieId', updatedData.categorieId || '');
          formData.append('valeursAttributs', JSON.stringify(updatedData.valeursAttributs || {}));
          formData.append('disponibilite', updatedData.disponibilite ? 'true' : 'false'); // Convertir en chaîne

          updatedData.photos.forEach((photo, index) => {
            formData.append(`photos[${index}][url]`, photo.url); // Assurez-vous que l'URL est une chaîne
            formData.append(`photos[${index}][couverture]`, photo.couverture ? 'true' : 'false'); // Convertir en chaîne
          });

          const response = await fetch(`${API_URL}/${id_Produit}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
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