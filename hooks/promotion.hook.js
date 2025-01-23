// hooks/promotion.hook.js

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/store';

export default function useFetchPromotion() {
  const setPromotionData = useAuthStore((state) => state.setPromotionData);

  const [getData, setData] = useState({
    isLoading: false,
    promotionData: [],
    status: null,
    serverError: null,
  });

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('http://localhost:3001/promotions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Statut de la réponse :', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du serveur :', errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données Promotions reçues :', data);

      if (Array.isArray(data)) {
        setPromotionData(data);

        setData((prev) => ({
          ...prev,
          promotionData: data,
          status: response.status,
          isLoading: false,
        }));
      } else {
        // Traiter le cas où les données des promotions ne sont pas un tableau valide
        setData((prev) => ({
          ...prev,
          promotionData: [],
          status: response.status,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Fetch Error:', error);

      setData((prev) => ({
        ...prev,
        isLoading: false,
        serverError: error.message || 'Erreur inconnue',
      }));
    }
  }, [setPromotionData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [getData];
}