// app/context/SearchContext.tsx

import { createContext, useState, ReactNode, useContext } from 'react';

// Définition du type pour les propriétés du contexte
type SearchContextProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

// Création d'un contexte avec une valeur par défaut de `undefined`
const SearchContext = createContext<SearchContextProps | undefined>(undefined);

// Composant Provider pour envelopper ton application
export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook pour utiliser le contexte
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext doit être utilisé à l\'intérieur de SearchProvider');
  }
  return context;
};
