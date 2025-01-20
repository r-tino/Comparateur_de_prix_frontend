// hooks/offre.hook.js

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/store';

export default function useFetchOffre() {
  const setOffreData = useAuthStore((state) => state.setOffreData);

  const [getData, setData] = useState({
    isLoading: false,
    offreData: [],
    status: null,
    serverError: null,
  });

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));
  
    try {
      const response = await fetch('http://localhost:3001/api/offres', {
        method: 'GET',
      });
  
      console.log('Statut de la réponse :', response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur du serveur :', errorData);
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Données Offres reçues :', data);
  
      if (Array.isArray(data)) {
        setOffreData(data);
  
        setData((prev) => ({
          ...prev,
          offreData: data,
          status: response.status,
          isLoading: false,
        }));
      } else {
        // Traiter le cas où la réponse n'est pas un tableau
        setData((prev) => ({
          ...prev,
          offreData: [],
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
  }, [setOffreData]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [getData];
}