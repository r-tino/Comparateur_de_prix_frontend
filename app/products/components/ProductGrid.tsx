import { useState,useEffect } from 'react';
import Image from 'next/image';
import useFetchProduit from '../../../hooks/produit.hook.js';
import { useAuthStore } from '../../../store/store.js';

interface Product {
  id_Produit: string;
  nom_Produit: string;
  description: string;
  prixInitial: number;
  photos: { url: string; couverture: boolean }[];
  utilisateur: { nom_user: string };
  categorie: { nomCategorie: string };
}

interface ProductGridProps {
  filters: {
    category: string;
    priceRange: [number, number];
    brand: string;
  };
  sort: string;
  page: number;
}

export default function ProductGrid({ filters, sort, page }: ProductGridProps) {
  const produitData = useAuthStore((state) => state.produitData);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useFetchProduit();

  // Filtrer les données basées sur les filtres
  const applyFilters = () => {
    let filtered = [...produitData];

      // Filtrer par catégorie
      if (filters.category) {
        filtered = filtered.filter((product) => {
          console.log("maaaaamaaaaa: ",filters.category)
          return product.categorie.nomCategorie.toLowerCase().trim() === filters.category.toLowerCase().trim();
        });
            
        
      }

    // Filtrer par plage de prix
    filtered = filtered.filter(
      (product) =>
        product.prixInitial >= filters.priceRange[0] &&
        product.prixInitial <= filters.priceRange[1]
    );

    // Filtrer par marque (exemple, à adapter selon votre structure de données)
    if (filters.brand) {
      filtered = filtered.filter((product) =>
        product.nom_Produit.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Trier les produits si nécessaire (par prix, etc.)
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.prixInitial - b.prixInitial);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.prixInitial - a.prixInitial);
    }

    setFilteredProducts(filtered);
  };

  // Appliquer les filtres chaque fois qu'ils changent
  useEffect(() => {
    applyFilters();
  }, [filters, produitData, sort]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <div
          key={product.id_Produit}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-48">
            <Image
              src={product.photos.find((photo) => photo.couverture)?.url || ''}
              alt={product.nom_Produit}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.nom_Produit}</h3>
            <p className="text-lg font-bold mb-2">
              {product.prixInitial.toFixed(2)} Ar
            </p>
            <p className="text-sm text-gray-500">
              Seller: {product.utilisateur.nom_user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
