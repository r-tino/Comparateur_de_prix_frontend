// hooks/produit.hook.js

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/store';

export default function useFetchProduit() {
  const setProduitData = useAuthStore((state) => state.setProduitData);

  const [getData, setData] = useState({
    isLoading: false,
    produitData: [],
    status: null,
    serverError: null,
  });

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('http://localhost:3001/produits', {
        method: 'GET',
      });

      console.log('Statut de la réponse :', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du serveur :', errorData);
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données Produits reçues :', data.data);

      if (Array.isArray(data.data)) {
        setProduitData(data.data);

        setData((prev) => ({
          ...prev,
          produitData: data.data,
          status: response.status,
          isLoading: false,
        }));
      } else {
        throw new Error('Les données des produits doivent être un tableau valide');
      }
    } catch (error) {
      console.error('Fetch Error:', error);

      setData((prev) => ({
        ...prev,
        isLoading: false,
        serverError: error.message || 'Erreur inconnue',
      }));
    }
  }, [setProduitData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [getData];
}