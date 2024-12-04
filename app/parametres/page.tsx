"use client"; // Assurez-vous que cette ligne est en haut du fichier

import React, { useState } from "react";

const AccountSettingsPage = () => {
  const [user, setUser] = useState({
    username: "John Doe",
    email: "johndoe@example.com",
    profileImage: "/images/laptop.jpg", // Image par défaut
  });
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      setNewProfileImage(null); // Réinitialiser l'image sélectionnée après l'enregistrement
      alert("Photo de profil mise à jour !");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Informations mises à jour avec succès !");
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert("Mot de passe mis à jour avec succès !");
      }, 1000);
    } else {
      alert("Les mots de passe ne correspondent pas.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen pt-20">
      <div className="max-w-3xl mx-auto">
        {/* Section Modifier la Photo de Profil */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 text-center">
          <h3 className="text-xl font-semibold text-black mb-4">Modifier la Photo de Profil</h3>
          <img
            src={newProfileImage || user.profileImage}
            alt="Photo de Profil"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover cursor-pointer"
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

        {/* Section Mise à Jour du Profil */}
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
              <label htmlFor="email" className="block text-sm text-black">Email</label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                disabled
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        </div>

        {/* Section Changer le Mot de Passe */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
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
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
