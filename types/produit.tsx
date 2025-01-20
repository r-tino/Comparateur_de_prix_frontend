export interface Product {
  id_Produit: string;
  nom_Produit: string;
  description: string;
  prixInitial: number;
  marque: string;
  note_Produit: number;
  photos: Photo[];
  categorie: string;
  contenu: string;
  groupe_cible: string;
  caracteristiques: string[];
}

export interface Photo {
  url: string;
}

export interface Vendeur {
  nom_Vendeur: string;
  note_Vendeur: number;
  logo: string;
  adresse_Vendeur: string;
  telephone_Vendeur: string;
  email_Vendeur: string;
}

export interface Offer {
  id_Offre: string;
  produit: Product;
  vendeur: Vendeur;
  prixOffre: number;
  quantite_Offre: number;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}