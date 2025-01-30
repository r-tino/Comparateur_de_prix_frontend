// hooks/produit.hook.js

import { useState, useEffect, useCallback } from 'react';
import { useProduitStore } from '../store';

const API_URL = 'http://localhost:3001/produits'; // Assurez-vous que l'URL correspond à votre configuration backend

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Utilisez le nom de votre upload preset
  formData.append('folder', 'échantillons/ecommerce'); // Spécifiez le dossier

  const response = await fetch('https://api.cloudinary.com/v1_1/diwlybpuc/image/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erreur Cloudinary:', errorData);
    throw new Error('Erreur lors du téléchargement de l\'image sur Cloudinary: ' + (errorData.error?.message || response.statusText));
  }

  const result = await response.json();
  return result.secure_url; // URL de l'image téléchargée
};

export const useFetchProduit = (page = 1, limit = 10, searchTerm = '', token) => {
  const setProduitData = useProduitStore((state) => state.setProduitData);

  const [getData, setData] = useState({
    isLoading: false,
    produitData: [],
    total: 0,
    status: null,
    serverError: null,
  });

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=${limit}&nom=${searchTerm}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Ajout du token pour l'authentification
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
      console.log('Données Produits reçues :', data.data);

      if (Array.isArray(data.data)) {
        if (typeof setProduitData === 'function') {
          setProduitData(data.data);
        } else {
          console.error('setProduitData is not a function');
        }

        setData((prev) => ({
          ...prev,
          produitData: data.data,
          total: data.total,
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
  }, [page, limit, searchTerm, setProduitData, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [getData];
};