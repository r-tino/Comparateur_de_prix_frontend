"use client"; // Assurez-vous que cette ligne est en haut du fichier

import React, { useState } from "react";

const AccountSettingsPage = () => {
  const [user, setUser] = useState({
    username: "John Doe",
    email: "johndoe@example.com",
    contact: "123-456-7890",
    address: "123 Main Street, Cityville",
    profileImage: "/images/laptop.jpg", // Image par défaut
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [showEditFields, setShowEditFields] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false); // État pour la section mot de passe
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileImage = () => {
    if (newProfileImage) {
      setUser({ ...user, profileImage: newProfileImage });
      setNewProfileImage(null);
      alert("Photo de profil mise à jour !");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Informations mises à jour avec succès !");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      alert("Mot de passe mis à jour avec succès !");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } else {
      alert("Les mots de passe ne correspondent pas.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto">
        {/* Section Photo de Profil */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-center">
          <h3 className="text-xl font-semibold text-black mb-4">Photo de Profil</h3>
          <img
            src={newProfileImage || user.profileImage}
            alt="Photo de Profil"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          />
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="hidden"
            onChange={handleProfileImageChange}
          />
          {newProfileImage && (
            <button
              onClick={handleSaveProfileImage}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
            >
              Sauvegarder la Photo
            </button>
          )}
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-black mb-6">Informations Utilisateur</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-sm text-black font-medium">Nom :</p>
              <p className="text-sm text-gray-600">{user.username}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-black font-medium">Adresse :</p>
              <p className="text-sm text-gray-600">{user.address}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-black font-medium">Contact :</p>
              <p className="text-sm text-gray-600">{user.contact}</p>
            </div>
          </div>

          <button
            onClick={() => setShowEditFields(!showEditFields)}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg w-full mt-10"
          >
            {showEditFields ? "Fermer les modifications" : "Modifier les informations"}
          </button>
          
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
          >
            {showPasswordChange ? "Fermer" : "Changer le Mot de Passe"}
          </button>
        </div>

        {/* Champs d'édition */}
        {showEditFields && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm text-black">Nom</label>
                <input
                  type="text"
                  id="username"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm text-black">Adresse</label>
                <input
                  type="text"
                  id="address"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="contact" className="block text-sm text-black">Contact</label>
                <input
                  type="text"
                  id="contact"
                  value={user.contact}
                  onChange={(e) => setUser({ ...user, contact: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
              >
                Sauvegarder les Modifications
              </button>
            </form>
          </div>
        )}

        {/* Section Changer le Mot de Passe */}
        {showPasswordChange && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
            <h3 className="text-xl font-semibold text-black mb-4">Changer le Mot de Passe</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm text-black">Nouveau Mot de Passe</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm text-black">Confirmer le Mot de Passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
              >
                Mettre à jour le Mot de Passe
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettingsPage;
