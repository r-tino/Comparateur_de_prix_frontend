// app/dashboard/vendeur/promotions/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit2, Trash2, Calendar, Percent, BarChart2 } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const promotionSchema = z.object({
  pourcentage: z.number().min(0, "Le pourcentage doit être positif").max(100, "Le pourcentage ne peut pas dépasser 100"),
  dateDebut: z.date(),
  dateFin: z.date(),
  prixPromotionnel: z.number().min(0, "Le prix doit être positif"),
  produit: z.string().min(1, "Le produit est requis"),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface Promotion extends PromotionFormData {
  id: number;
  status: "Active" | "Expirée" | "À venir";
  produit_nom: string;
  prix_initial: number;
}

const mockProducts = [
  { id: "1", name: "Produit A", prix_initial: 10000 },
  { id: "2", name: "Produit B", prix_initial: 15000 },
  { id: "3", name: "Produit C", prix_initial: 8500 },
];

const mockPromotions: Promotion[] = [
  {
    id: 1,
    pourcentage: 20,
    dateDebut: new Date("2024-01-20"),
    dateFin: new Date("2024-02-20"),
    prixPromotionnel: 8000,
    produit: "1",
    produit_nom: "Produit A",
    prix_initial: 10000,
    status: "Active",
  },
  {
    id: 2,
    pourcentage: 30,
    dateDebut: new Date("2024-02-01"),
    dateFin: new Date("2024-03-01"),
    prixPromotionnel: 10500,
    produit: "2",
    produit_nom: "Produit B",
    prix_initial: 15000,
    status: "À venir",
  },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotions, setSelectedPromotions] = useState<number[]>([]);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
  const [filterOption, setFilterOption] = useState<string>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>(promotions);
  const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState(false);
  const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState(false);
  const promotionsPerPage = 5;

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
  });

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    reset({
      ...promotion,
    });
  };

  const handleDeleteConfirmation = (promotionId: number) => {
    setPromotionToDelete(promotionId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (promotionToDelete !== null) {
      setPromotions(promotions.filter((promotion) => promotion.id !== promotionToDelete));
    }
    setIsDeleteModalOpen(false);
    setPromotionToDelete(null);
  };

  const handleMultipleDelete = () => {
    setPromotions(promotions.filter((promotion) => !selectedPromotions.includes(promotion.id)));
    setSelectedPromotions([]);
  };

  const calculatePromotionalPrice = (prix: number, pourcentage: number) => {
    return prix * (1 - pourcentage / 100);
  };

  const handleSave = (data: PromotionFormData) => {
    const selectedProduct = mockProducts.find(p => p.id === data.produit);
    if (selectedProduct) {
      const prixPromotionnel = calculatePromotionalPrice(selectedProduct.prix_initial, data.pourcentage);
      
      const now = new Date();
      let status: "Active" | "Expirée" | "À venir";
      if (data.dateDebut > now) {
        status = "À venir";
      } else if (data.dateFin < now) {
        status = "Expirée";
      } else {
        status = "Active";
      }

      if (selectedPromotion) {
        setPromotions(promotions.map(p => p.id === selectedPromotion.id ? {
          ...p,
          ...data,
          produit_nom: selectedProduct.name,
          prix_initial: selectedProduct.prix_initial,
          prixPromotionnel,
          status,
        } : p));
      } else {
        const newPromotion: Promotion = {
          ...data,
          id: promotions.length + 1,
          produit_nom: selectedProduct.name,
          prix_initial: selectedProduct.prix_initial,
          prixPromotionnel,
          status,
        };
        setPromotions([...promotions, newPromotion]);
      }
    }
    setSelectedPromotion(null);
    setIsAddModalOpen(false);
    reset();
  };

  const handleCheckboxChange = (promotionId: number) => {
    setSelectedPromotions(prev => 
      prev.includes(promotionId) 
        ? prev.filter(id => id !== promotionId)
        : [...prev, promotionId]
    );
  };

  const filterAndSortPromotions = useCallback((promotions: Promotion[]) => {
    return promotions
      .filter(promotion =>
        searchTerm === "" ||
        promotion.produit_nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          return b.dateDebut.getTime() - a.dateDebut.getTime();
        } else if (filterOption === "price") {
          return b.prixPromotionnel - a.prixPromotionnel;
        } else if (filterOption === "reduction") {
          return b.pourcentage - a.pourcentage;
        }
        return 0;
      });
  }, [filterOption, searchTerm]);

  useEffect(() => {
    setFilteredPromotions(filterAndSortPromotions(promotions));
  }, [promotions, filterAndSortPromotions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Expirée":
        return "bg-red-500";
      case "À venir":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-night-blue text-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Promotions</h1>
          <p className="text-text-secondary mt-2">
            Gérez les promotions pour attirer plus de clients.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Rechercher une promotion..." 
            className="pl-10 bg-dark-blue text-text-primary border-dark-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterOption} onValueChange={setFilterOption}>
          <SelectTrigger className="bg-dark-blue text-text-primary border-dark-blue w-[180px]">
            <BarChart2 className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date de début</SelectItem>
            <SelectItem value="price">Prix promotionnel</SelectItem>
            <SelectItem value="reduction">Réduction</SelectItem>
          </SelectContent>
        </Select>
        {selectedPromotions.length > 0 && (
          <Button 
            onClick={handleMultipleDelete}
            variant="destructive"
          >
            Supprimer la sélection ({selectedPromotions.length})
          </Button>
        )}
        
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-yellow-600 hover:bg-yellow-500 ml-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Créer une Promotion
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-text-secondary">Produit</TableHead>
            <TableHead className="text-text-secondary">Prix Initial</TableHead>
            <TableHead className="text-text-secondary">Réduction</TableHead>
            <TableHead className="text-text-secondary">Prix Promotionnel</TableHead>
            <TableHead className="text-text-secondary">Date de début</TableHead>
            <TableHead className="text-text-secondary">Date de fin</TableHead>
            <TableHead className="text-text-secondary">Statut</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPromotions
              .slice((currentPage - 1) * promotionsPerPage, currentPage * promotionsPerPage)
              .map((promotion) => (
              <TableRow key={promotion.id}>
              <TableCell>
                <Checkbox
                  checked={selectedPromotions.includes(promotion.id)}
                  onCheckedChange={() => handleCheckboxChange(promotion.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{promotion.produit_nom}</TableCell>
              <TableCell>{promotion.prix_initial.toLocaleString()} Ar</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-yellow-400 hover:bg-yellow-500">
                  -{promotion.pourcentage}%
                </Badge>
              </TableCell>
              <TableCell>{promotion.prixPromotionnel.toLocaleString()} Ar</TableCell>
              <TableCell>{format(promotion.dateDebut, "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(promotion.dateFin, "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={getStatusColor(promotion.status)}
                >
                  {promotion.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="secondary"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => handleEdit(promotion)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleDeleteConfirmation(promotion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-6">
        <Button 
          variant="outline"
          className="bg-dark-blue text-text-primary hover:bg-dark-blue/90"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span className="text-sm text-text-secondary">
          Page {currentPage} de {Math.ceil(filteredPromotions.length / promotionsPerPage)}
        </span>
        <Button 
          variant="outline"
          className="bg-dark-blue text-text-primary hover:bg-dark-blue/90"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPromotions.length / promotionsPerPage)))} 
          disabled={currentPage === Math.ceil(filteredPromotions.length / promotionsPerPage)}
        >
          Suivant
        </Button>
      </div>

      <Dialog open={isAddModalOpen || !!selectedPromotion} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setSelectedPromotion(null);
        }
      }}>
        <DialogContent className="bg-night-blue text-text-primary">
          <DialogHeader>
            <DialogTitle>{selectedPromotion ? "Modifier la Promotion" : "Créer une Promotion"}</DialogTitle>
            <DialogDescription className="text-text-secondary">
              {selectedPromotion ? "Modifiez les informations de la promotion." : "Remplissez les informations ci-dessous pour créer une promotion."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="produit">Produit</Label>
              <Select onValueChange={(value) => setValue("produit", value)}>
                <SelectTrigger id="produit" className="bg-dark-blue text-text-primary border-dark-blue">
                  <SelectValue placeholder="Choisir un produit" />
                </SelectTrigger>
                <SelectContent className="bg-night-blue text-text-primary">
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - Prix: {product.prix_initial.toLocaleString()} Ar
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.produit && <p className="text-red-500">{errors.produit.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pourcentage">Pourcentage de réduction</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <Input 
                  id="pourcentage" 
                  type="number"
                  {...register("pourcentage", { valueAsNumber: true })}
                  placeholder="Pourcentage de réduction" 
                  className="pl-10 bg-dark-blue text-text-primary border-dark-blue" 
                />
              </div>
              {errors.pourcentage && <p className="text-red-500">{errors.pourcentage.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début</Label>
                <Popover open={isStartDatePopoverOpen} onOpenChange={setIsStartDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-dark-blue text-text-primary border-dark-blue",
                        !watch("dateDebut") && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watch("dateDebut") ? 
                        format(watch("dateDebut"), "dd/MM/yyyy", { locale: fr }) : 
                        <span>Choisir une date</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watch("dateDebut")}
                      onSelect={(date) => {
                        if (date) {
                          setValue("dateDebut", date);
                          setIsStartDatePopoverOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateDebut && <p className="text-red-500">{errors.dateDebut.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin</Label>
                <Popover open={isEndDatePopoverOpen} onOpenChange={setIsEndDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-dark-blue text-text-primary border-dark-blue",
                        !watch("dateFin") && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watch("dateFin") ? 
                        format(watch("dateFin"), "dd/MM/yyyy", { locale: fr }) : 
                        <span>Choisir une date</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watch("dateFin")}
                      onSelect={(date) => {
                        if (date) {
                          setValue("dateFin", date);
                          setIsEndDatePopoverOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.dateFin && <p className="text-red-500">{errors.dateFin.message}</p>}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                className="bg-gray-400 text-gray-800 hover:bg-gray-200"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedPromotion(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-yellow-600 hover:bg-yellow-500">
                {selectedPromotion ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-night-blue text-text-primary">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Êtes-vous sûr de vouloir supprimer cette promotion ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              className="bg-gray-400 hover:bg-gray-200 text-gray-10"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}  