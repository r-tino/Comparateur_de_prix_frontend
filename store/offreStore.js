// store/offreStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useOffreStore = create(
  persist(
    (set) => ({
      offreData: [],
      setOffreData: (data) => {
        if (Array.isArray(data)) {
          set(() => ({ offreData: data }));
        } else {
          console.warn('Les données des offres doivent être un tableau valide');
        }
      },
      fetchOffres: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/offres', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            if (Array.isArray(responseData.data)) {
              set({ offreData: responseData.data });
            } else {
              console.warn('La structure des données reçues de l\'API des offres est inattendue');
            }
          } else {
            throw new Error('Échec de la récupération des offres');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des offres:', error);
        }
      },
      addOffre: async (offreData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch('http://localhost:3001/offres', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(offreData),
          });

          if (response.ok) {
            const newOffre = await response.json();
            set((state) => ({
              offreData: [...state.offreData, newOffre],
            }));
            return newOffre;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de l'ajout de l'offre");
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'offre:', error);
          throw error;
        }
      },
      updateOffre: async (id_Offre, updatedData) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/offres/${id_Offre}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            const updatedOffre = await response.json();
            set((state) => ({
              offreData: state.offreData.map((offre) =>
                offre.id_Offre === id_Offre ? { ...offre, ...updatedData } : offre
              ),
            }));
            return updatedOffre;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la mise à jour de l'offre");
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'offre:', error);
          throw error;
        }
      },
      deleteOffre: async (id_Offre) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Token non disponible");

          const response = await fetch(`http://localhost:3001/offres/${id_Offre}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set((state) => ({
              offreData: state.offreData.filter((offre) => offre.id_Offre !== id_Offre),
            }));
            return { message: 'Offre supprimée avec succès' };
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la suppression de l'offre");
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'offre:', error);
          throw error;
        }
      },
    }),
    {
      name: 'offre-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ offreData: state.offreData }),
    }
  )
);

export default useOffreStore;