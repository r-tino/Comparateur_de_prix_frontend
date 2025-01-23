// store/categorieStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCategorieStore = create(
  persist(
    (set) => ({
      categorieData: [],
      setCategorieData: (data) => {
        if (Array.isArray(data)) {
          set(() => ({ categorieData: data }));
        } else {
          console.warn('Les données des catégories doivent être un tableau valide');
        }
      },
      fetchCategories: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/categorie', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
              set({ categorieData: responseData.data });
            } else {
              console.warn('La structure des données reçues de l\'API des catégories est inattendue');
            }
          } else {
            throw new Error('Échec de la récupération des catégories');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des catégories:', error);
        }
      },
      addCategorie: async (categorieData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/categorie', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(categorieData),
          });

          if (response.ok) {
            const newCategorie = await response.json();
            set((state) => ({
              categorieData: [...state.categorieData, newCategorie],
            }));
            return newCategorie;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout de la catégorie");
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la catégorie:', error);
          throw error;
        }
      },
      updateCategorie: async (id_Categorie, updatedData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/categorie/${id_Categorie}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedCategorie = await response.json();
            set((state) => ({
              categorieData: state.categorieData.map((categorie) =>
                categorie.id_Categorie === id_Categorie ? { ...categorie, ...updatedCategorie } : categorie
              ),
            }));
            return updatedCategorie;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de la catégorie");
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la catégorie:', error);
          throw error;
        }
      },
      deleteCategorie: async (id_Categorie) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/categorie/${id_Categorie}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              categorieData: state.categorieData.filter((categorie) => categorie.id_Categorie !== id_Categorie),
            }));
            return { message: 'Catégorie supprimée avec succès' };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression de la catégorie");
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          throw error;
        }
      },
      addAttribut: async (categorieId, attributData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/categorie/${categorieId}/attribut`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(attributData),
          });

          if (response.ok) {
            const newAttribut = await response.json();
            set((state) => ({
              categorieData: state.categorieData.map((categorie) =>
                categorie.id_Categorie === categorieId
                  ? { ...categorie, attributs: [...categorie.attributs, newAttribut] }
                  : categorie
              ),
            }));
            return newAttribut;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout de l'attribut");
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'attribut:', error);
          throw error;
        }
      },
      updateAttribut: async (categorieId, attributId, updatedData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/categorie/${categorieId}/attribut/${attributId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedAttribut = await response.json();
            set((state) => ({
              categorieData: state.categorieData.map((categorie) =>
                categorie.id_Categorie === categorieId
                  ? {
                      ...categorie,
                      attributs: categorie.attributs.map((attribut) =>
                        attribut.id_Attribut === attributId ? { ...attribut, ...updatedAttribut } : attribut
                      ),
                    }
                  : categorie
              ),
            }));
            return updatedAttribut;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de l'attribut");
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'attribut:', error);
          throw error;
        }
      },
      deleteAttribut: async (categorieId, attributId) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/categorie/${categorieId}/attribut/${attributId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              categorieData: state.categorieData.map((categorie) =>
                categorie.id_Categorie === categorieId
                  ? {
                      ...categorie,
                      attributs: categorie.attributs.filter((attribut) => attribut.id_Attribut !== attributId),
                    }
                  : categorie
              ),
            }));
            return { message: 'Attribut supprimé avec succès' };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression de l'attribut");
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'attribut:', error);
          throw error;
        }
      },
    }),
    {
      name: 'categorie-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ categorieData: state.categorieData }),
    }
  )
);

export default useCategorieStore;