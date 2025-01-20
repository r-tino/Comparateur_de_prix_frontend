//  app/components/CategoryBar.tsx


import Link from 'next/link';
import { Laptop } from 'lucide-react'; // Garder uniquement les icônes utilisées
import useFetchCategorie from '../../hooks/categorie.hook.js';
import { useAuthStore } from '../../store/store.js';

export default function CategoryBar() {
  useFetchCategorie();
  const categorieData = useAuthStore((state) => state.categorieData);
  console.log("categorieListe: ", categorieData);

  return (
    <div className="bg-[#1B3A57] border-t border-gray-700 mt-16">
      <nav className="container mx-auto px-4 flex justify-center">
        <div className="overflow-x-auto">
          <ul className="flex py-2 gap-8 justify-center">
            {categorieData.map((category: { id_Categorie: string; nomCategorie: string }) => (
              <li key={category.id_Categorie}>
                <Link 
                  href={`/categories/${category.id_Categorie}`}
                  className="flex flex-col items-center gap-1 text-white hover:text-blue-400 transition-colors group"
                >
                  <Laptop className="w-5 h-5 group-hover:text-blue-400" />
                  <span className="text-xs whitespace-nowrap">{category.nomCategorie}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}