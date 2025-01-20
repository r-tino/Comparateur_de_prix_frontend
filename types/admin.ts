// types/admin.ts

import { ReactNode } from "react"

export type Role = 'Admin' | 'Vendeur' | 'Visiteur'

export interface User {
  id: string
  nom: string
  adresse: string
  email: string
  contact: string
  role: Role
  dateCreation: Date
  dernierConnexion: Date
  photoProfile?: string
}

export interface Product {
  vendeur: ReactNode
  id: string
  nom: string
  description: string
  qualiteMoyenne: number
  prixInitial: number
  datePublication: Date
  disponibilite: boolean
  userId: string // To track who created it
  categoryId: string
}

export interface Category {
  id: string
  nom: string
  isActive: boolean
}

export interface Offer {
  id: string
  prixOffre: number
  stock: number
  dateExpiration: Date
  productId: string
  userId: string // To track who created it
}

export interface Promotion {
  id: string
  pourcentage: number
  dateDebut: Date
  dateFin: Date
  prixPromotionnel: number
  productId: string
  userId: string // To track who created it
}

export interface DeletionRequest {
  id: string;
  nom: string;
  email: string;
  dateDemande: string;
  status: 'En attente' | 'Approuvée' | 'Refusée';
}