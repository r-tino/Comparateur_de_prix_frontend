'use client';

import React from "react";
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import { Product, StoreRating } from '@/types/produit';

const products: Product[] = [
  {
    id: 1,
    name: 'Smartphone XYZ',
    image: '/images/smartphone.jpg',
    price: 499.99,
    rating: 4,
    description: 'Un smartphone puissant avec toutes les fonctionnalités modernes.',
    storeRatings: [
      {
        name: 'Smartphone XYZ 5g',
        store: 'Amzone',
        price: 499.99,
        rating: 4,
        stock: 31,
        sellerName: 'Amzone Official',
        sellerImage: '/images/smartphone.jpg',
        sellerAddress: '123 E-commerce St, Internet City',
        sellerContact: '+1 234 567 890',
        sellerEmail: 'support@amzone.com',
        sellerDescription: 'Leader mondial du e-commerce, offrant une large gamme de produits.',
      },
      {
        name: 'Smartphone XYZ C version US',
        store: 'Alibaba',
        price: 479.99,
        rating: 5,
        stock: 25,
        sellerName: 'Alibaba Group',
        sellerImage: '/images/smartphone.jpg',
        sellerAddress: '456 Global Trade Ave, E-commerce City',
        sellerContact: '+86 571 8502 2088',
        sellerEmail: 'service@alibaba.com',
        sellerDescription: 'Plateforme de commerce en ligne B2B leader mondial.',
      },
    ],
  },
  {
    id: 2,
    name: 'Laptop ABC',
    image: '/images/laptop.jpg',
    price: 899.99,
    rating: 5,
    description: 'Un ordinateur portable idéal pour les professionnels et les gamers.',
    storeRatings: [
      {
        name: 'Laptop ABC i7 9em',
        store: 'Store A',
        price: 899.99,
        rating: 5,
        stock: 9,
        sellerName: 'Store A Electronics',
        sellerImage: '/images/laptop.jpg',
        sellerAddress: '789 Tech Boulevard, Gadget City',
        sellerContact: '+1 987 654 321',
        sellerEmail: 'support@storea.com',
        sellerDescription: 'Spécialiste en électronique haut de gamme et matériel informatique.',
      },
      {
        name: 'Laptop ABC i5 10em',
        store: 'Store C',
        price: 879.99,
        rating: 4,
        stock: 14,
        sellerName: 'Store C Computers',
        sellerImage: '/images/laptop.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'info@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en informatique et accessoires.',
      },
    ],
  },
  {
    id: 3,
    name: 'Machine à Café',
    image: '/images/coffee-machine.jpg',
    price: 299.99,
    rating: 3,
    description: 'Préparez du café délicieux rapidement avec cette machine compacte.',
    storeRatings: [
      {
        name: 'Machine à Café 45w',
        store: 'Store B',
        price: 299.99,
        rating: 4,
        stock: 2,
        sellerName: 'Store B Home Appliances',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '567 Kitchen Ave, Appliance City',
        sellerContact: '+1 369 258 147',
        sellerEmail: 'sales@storeb.com',
        sellerDescription: 'Spécialiste en appareils électroménagers de qualité.',
      },
      {
        name: 'Machine à Café',
        store: 'Store C',
        price: 459.99,
        rating: 4.5,
        stock: 1,
        sellerName: 'Store C Home',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'home@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en électroménager.',
      },
      {
        name: 'Machine à Café neuf',
        store: 'Store B',
        price: 399.99,
        rating: 4,
        stock: 3,
        sellerName: 'Store B Home Appliances',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '567 Kitchen Ave, Appliance City',
        sellerContact: '+1 369 258 147',
        sellerEmail: 'sales@storeb.com',
        sellerDescription: 'Spécialiste en appareils électroménagers de qualité.',
      },
      {
        name: 'Machine à Café 50w rapide',
        store: 'Store C',
        price: 259.99,
        rating: 3,
        stock: 10,
        sellerName: 'Store C Home',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'home@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en électroménager.',
      },
      {
        name: 'Machine à Café 45w fast',
        store: 'Store B',
        price: 300.99,
        rating: 5,
        stock: 15,
        sellerName: 'Store B Home Appliances',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '567 Kitchen Ave, Appliance City',
        sellerContact: '+1 369 258 147',
        sellerEmail: 'sales@storeb.com',
        sellerDescription: 'Spécialiste en appareils électroménagers de qualité.',
      },
      {
        name: 'Machine à Café 50w rapide ',
        store: 'Store C',
        price: 275.99,
        rating: 5,
        stock: 31,
        sellerName: 'Store C Home',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'home@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en électroménager.',
      },
      {
        name: 'Machine à Café 45w',
        store: 'Store B',
        price: 299.99,
        rating: 4,
        stock: 23,
        sellerName: 'Store B Home Appliances',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '567 Kitchen Ave, Appliance City',
        sellerContact: '+1 369 258 147',
        sellerEmail: 'sales@storeb.com',
        sellerDescription: 'Spécialiste en appareils électroménagers de qualité.',
      },
      {
        name: 'Machine à Café 50w rapide',
        store: 'Store C',
        price: 289.99,
        rating: 3,
        stock: 12,
        sellerName: 'Store C Home',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'home@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en électroménager.',
      },
      {
        name: 'Machine à Café',
        store: 'Store B',
        price: 299.99,
        rating: 4,
        stock: 9,
        sellerName: 'Store B Home Appliances',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '567 Kitchen Ave, Appliance City',
        sellerContact: '+1 369 258 147',
        sellerEmail: 'sales@storeb.com',
        sellerDescription: 'Spécialiste en appareils électroménagers de qualité.',
      },
      {
        name: 'Machine à Café 50w rapide',
        store: 'Store C',
        price: 289.99,
        rating: 3,
        stock: 31,
        sellerName: 'Store C Home',
        sellerImage: '/images/coffee-machine.jpg',
        sellerAddress: '321 Computer Lane, Tech Town',
        sellerContact: '+1 246 135 790',
        sellerEmail: 'home@storec.com',
        sellerDescription: 'Votre destination pour tous vos besoins en électroménager.',
      },
    ],
  },
];

function SellerModal({ seller }: { seller: StoreRating }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Image
          src={seller.sellerImage}
          alt={seller.sellerName}
          width={100}
          height={100}
          className="rounded-full"
        />
        <h3 className="text-lg font-semibold mt-2">{seller.sellerName}</h3>
        <p className="text-sm text-gray-500">{seller.store}</p>
      </div>
      <div>
        <p><strong>Adresse:</strong> {seller.sellerAddress}</p>
        <p><strong>Contact:</strong> {seller.sellerContact}</p>
        <p><strong>Email:</strong> {seller.sellerEmail}</p>
        <div className="flex items-center mt-2">
          <strong className="mr-2">Note:</strong>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(seller.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2">({seller.rating}/5)</span>
        </div>
      </div>
      <div className="col-span-full">
        <p><strong>Description:</strong> {seller.sellerDescription}</p>
        <p className="text-lg font-semibold text-green-600 mt-2">Prix: {seller.price.toFixed(2)} Ar</p>
      </div>
    </div>
  );
}

export default function ProductDetails({ params }: { params: { id: string } }) {
  const product = products.find((product) => product.id === Number(params.id));

  if (!product) {
    return <p>Produit non trouvé</p>;
  }

  return (
    <div className="bg-gray-50 p-8 space-y-8 pt-20">
      {/* Premier block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <div className="bg-white rounded-lg shadow p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-contain mx-auto"
          />
        </div>

        {/* Détails */}
        <div className="bg-white rounded-lg shadow p-4">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-5">{product.name}</h1>
          <p className="text-yellow-500 mt-2">Note: {product.rating} ⭐</p>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <p className="text-lg font-bold text-green-600 mt-4">{product.price.toFixed(2)} Ar</p>
        </div>

        {/* Graphique */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center">
          {/* Placeholder pour le graphique */}
          <div className="text-center">
            <p>Graphique comparatif (exemple)</p>
            <div className="bg-blue-100 w-full h-40 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Deuxième block */}
      <div className=" ">
        {/* Tableau comparatif */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comparer les prix</h2>
          <table className="w-full text-sm border-collapse border border-gray-200">
            <thead className="text-[12px] text-gray-500  bg-gray-100 ">
              <tr>
                <th className="border border-gray-200 p-2">Nom du produits</th>
                <th className="border border-gray-200 p-2">Prix</th>
                <th className="border border-gray-200 p-2">Magasin et évaluation</th>
              </tr>
            </thead>
            <tbody>
              {product.storeRatings.map((store, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="border border-gray-200 p-2 text-gray-800">{store.name}</td>
                  <td className="border border-gray-200 p-2 text-green-600">{store.price.toFixed(2)} Ar</td>
                  <td className="border border-gray-200 p-2 text-gray-800">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                      <div className="">
                <span className="font-semibold text-sm">{store.store}</span>
                      </div>
                      <div className="flex flex-col text-xs">
                        <span className="text-yellow-500">⭐{store.rating}/5</span>
                        <span className="text-gray-600">({store.stock})</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-gray-800 text-[12px] mt-1 cursor-pointer hover:underline text-center mt-3">
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Détails du vendeur</DialogTitle>
                        </DialogHeader>
                        <SellerModal seller={store} />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

