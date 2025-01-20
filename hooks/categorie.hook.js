// hooks/categorie.hook.js

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/store";

export default function useFetchCategorie() {
  const setCategorieData = useAuthStore((state) => state.setCategorieData);

  const [getData, setData] = useState({
    isLoading: false,
    categorieData: [],
    status: null,
    serverError: null,
  });

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const token = localStorage.getItem("token");
      console.log('Token:', token); // Log the token to verify it's being retrieved

      if (!token) {
        throw new Error("Token non disponible");
      }

      const response = await fetch(`http://localhost:3001/categorie`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Statut de la réponse :", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du serveur :", errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Données Catégories reçues :", data.data);

      if (Array.isArray(data.data)) {
        // Assurez-vous que les attributs sont inclus et gérés correctement
        const formattedData = data.data.map((category) => ({
          ...category,
          attributs: category.attributs || [], // Assurez-vous que les attributs sont initialisés
        }));

        setCategorieData(formattedData);

        setData((prev) => ({
          ...prev,
          categorieData: formattedData,
          status: response.status,
          isLoading: false,
        }));
      } else {
        throw new Error('Les données des catégories doivent être un tableau valide');
      }
    } catch (error) {
      console.error("Fetch Error:", error);

      setData((prev) => ({
        ...prev,
        isLoading: false,
        serverError: error.message || "Erreur inconnue",
      }));
    }
  }, [setCategorieData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [getData];
}