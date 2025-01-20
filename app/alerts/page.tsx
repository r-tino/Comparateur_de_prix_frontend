/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Bell, Edit, Heart, Trash2} from "lucide-react"; // Import the X icon for remove action
import React, { useState } from "react";
import Link from "next/link"; // Import Link from next/link

const SelectionPage = () => {
  const favorites = [
    { id: 1, name: "Produit A", image: "/images/smartphone.jpg", price: 25 },
    { id: 2, name: "Produit B", image: "/images/laptop.jpg", price: 40 },
    { id: 3, name: "Produit C", image: "/images/casque.jpg", price: 60 },
    { id: 4, name: "Produit D", image: "/images/fashion.jpg", price: 35 },
    { id: 3, name: "Produit C", image: "/images/casque.jpg", price: 60 },
    { id: 4, name: "Produit D", image: "/images/fashion.jpg", price: 35 },
  ];

  const visited = [
    { id: 3, name: "Produit E", image: "/images/laptop.jpg", price: 15 },
    { id: 6, name: "Produit F", image: "/images/frigo.png", price: 20 },
    { id: 7, name: "Produit G", image: "/images/tv.png", price: 45 },
    { id: 8, name: "Produit H", image: "/images/montre.jpg", price: 50 },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [updatedVisited, setUpdatedVisited] = useState(visited); // State for visited products

  const handleAlert = (product: React.SetStateAction<null>) => {
    setSelectedProduct(product);
    setSelectedDiscount(null);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedDiscount(null);
  };

  const handleDiscountChange = (discount: number | React.SetStateAction<null>) => {
    setSelectedDiscount(discount);
  };

  // Function to remove product from the visited list
  const removeProduct = (productId) => {
    setUpdatedVisited((prevVisited) =>
      prevVisited.filter((product) => product.id !== productId)
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-20 text-center pt-20">
      {/* Section Produits Visités */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-black">Mes alerts prix</h2>
      <div className="space-y-6 mx-auto w-full max-w-4xl">
        {updatedVisited.map((product) => (
          <div
            key={product.id}
            className="flex items-center bg-white border border-gray-300 rounded-lg shadow-lg p-4 transform hover:scale-105 transition duration-200 relative"
          >
            {/* Conteneur séparé pour l'image */}
            <div className="flex-shrink-0 p-4">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
            {/* Détails du produit */}
            <div className="ml-4 text-left w-full">
              <h3 className="text-lg font-semibold text-black">{product.name}</h3>
              <p className="text-sm text-red-500 font-medium">{product.price} €</p>
              {/* Links for activating alert, removing product, and viewing product */}
              <div className="ml-auto flex space-x-20 mt-20">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAlert(product);
                  }}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-5 w-5" />
                  <span className="text-sm">Modifier le prix souhaité</span>
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    removeProduct(product.id); // Remove the product from the list
                  }}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-sm">Annuler</span>
                </a>
                {/* Bouton Voir produit */}
                <Link href={`/products/${product.id}`} className="flex items-center space-x-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    <span className="text-sm">Voir produit</span>
                  </button>
                </Link>
                {/* Header Icone to remove the product */}
                <div
                  onClick={() => removeProduct(product.id)}
                  className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-500"
                >
                  <Bell className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">
              Alerte Prix pour {selectedProduct.name}
            </h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <p className="text-sm text-gray-700 mb-4">
              Prix actuel : <span className="text-red-500">{selectedProduct.price} €</span>
            </p>
            <p className="text-sm text-gray-700 font-medium mb-4">
              Choisissez un prix réduit pour recevoir une alerte :
            </p>
            <div className="space-y-2">
              {[10, 20, 30].map((reduction) => {
                const reducedPrice = (selectedProduct.price * (1 - reduction / 100)).toFixed(2);
                return (
                  <label
                    key={reduction}
                    className="flex items-center space-x-2 text-black"
                  >
                    <input
                      type="radio"
                      name="discount"
                      value={reduction}
                      checked={selectedDiscount === reduction}
                      onChange={() => handleDiscountChange(reduction)}
                      className="form-radio text-blue-500"
                    />
                    <span>-{reduction}% : {reducedPrice} €</span>
                  </label>
                );
              })}
            </div>
            <button
              onClick={() =>
                alert(
                  `Alerte activée pour ${selectedProduct.name} à un prix de ${
                    selectedDiscount
                      ? (selectedProduct.price * (1 - selectedDiscount / 100)).toFixed(2)
                      : selectedProduct.price
                  } €`
                )
              }
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              disabled={!selectedDiscount}
            >
              Confirmer
            </button>
            <button
              onClick={closeModal}
              className="mt-2 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionPage;
