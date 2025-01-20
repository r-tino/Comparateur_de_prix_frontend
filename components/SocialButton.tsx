// components/SocialButton.tsx

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface SocialButtonProps {
  Icon: LucideIcon | React.ElementType;
  text: string;
  gradient: string; // Classe utilitaire pour le dégradé
  onClick?: () => void;
}

export function SocialButton({ Icon, text, gradient, onClick }: SocialButtonProps) {
  return (
    <Button
      variant="outline"
      className={`w-full ${gradient} text-white border-gray-500 hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {text}
    </Button>
  );
}
