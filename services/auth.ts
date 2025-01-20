// services/auth.ts

// services/auth.ts

interface LoginResponse {
  token: string;
  user: {
    id_User: string;
    nom_user: string;
    adress: string;
    email: string;
    contact: string;
    role: string;
    dateCreation: string;
    derniereConnexion: string | null;
    photoProfil: string;
    photoPublicId: string | null;
  };
}

export const loginUser = async (email: string, motDePasse: string): Promise<LoginResponse | null> => {
  try {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, motDePasse }), // Utilisation de 'motDePasse' pour correspondre au backend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur inconnue');
    }

    const result: LoginResponse = await response.json();
    return result;
  } catch (error: unknown) {
    console.error('Erreur lors de la connexion:', error);
    return null;
  }
};

export const registerUser = async (data: {
  username: string;
  address: string;
  contact: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'Visiteur' | 'Vendeur';
}): Promise<{ message: string } | null> => {
  try {
    const response = await fetch('http://localhost:3001/utilisateurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom_user: data.username,
        adress: data.address,
        contact: data.contact,
        email: data.email,
        motDePasse: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur inconnue');
    }

    const result: { message: string } = await response.json();
    return result;
  } catch (error: unknown) {
    console.error('Erreur lors de l\'inscription:', error);
    return null;
  }
};