// app/dashboard/vendeur/offres/page.tsx

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
import { Search, Plus, Edit2, Trash2, Package, Banknote, BarChart2, Calendar } from 'lucide-react';
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

const offerSchema = z.object({
  prix_offre: z.string().min(1, "Le prix est requis"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  date_expiration: z.date(),
  produit: z.string().min(1, "Le produit est requis"),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface Offer extends OfferFormData {
  id: number;
  status: "Active" | "Expirée";
  produit_nom: string;
  produit_prix_initial: string;
  pourcentage_reduction: number;
}

const mockOffers: Offer[] = [
  {
    id: 1,
    prix_offre: "8,000 Ar",
    produit: "1",
    produit_nom: "Produit A",
    produit_prix_initial: "10,000 Ar",
    pourcentage_reduction: 20,
    stock: 25,
    status: "Active",
    date_expiration: new Date("2024-02-01"),
  },
  {
    id: 2,
    prix_offre: "12,000 Ar",
    produit: "2",
    produit_nom: "Produit B",
    produit_prix_initial: "15,000 Ar",
    pourcentage_reduction: 20,
    stock: 10,
    status: "Expirée",
    date_expiration: new Date("2024-01-15"),
  },
];

const mockProducts = [
  { id: "1", name: "Produit A", prix_initial: "10,000 Ar" },
  { id: "2", name: "Produit B", prix_initial: "15,000 Ar" },
  { id: "3", name: "Produit C", prix_initial: "8,500 Ar" },
];

export default function OffresPage() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
  const [filterOption, setFilterOption] = useState<string>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const offersPerPage = 5;

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
  });

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    reset({
      ...offer,
    });
  };

  const handleDeleteConfirmation = (offerId: number) => {
    setOfferToDelete(offerId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (offerToDelete !== null) {
      setOffers(offers.filter((offer) => offer.id !== offerToDelete));
    }
    setIsDeleteModalOpen(false);
    setOfferToDelete(null);
  };

  const handleMultipleDelete = () => {
    setOffers(offers.filter((offer) => !selectedOffers.includes(offer.id)));
    setSelectedOffers([]);
  };

  const calculateReduction = (prixOffre: string, prixInitial: string) => {
    const offre = parseFloat(prixOffre.replace(/[^0-9]/g, ""));
    const initial = parseFloat(prixInitial.replace(/[^0-9]/g, ""));
    return Math.round(((initial - offre) / initial) * 100);
  };

  const handleSave = (data: OfferFormData) => {
    const selectedProduct = mockProducts.find(p => p.id === data.produit);
    if (selectedProduct) {
      const pourcentageReduction = calculateReduction(data.prix_offre, selectedProduct.prix_initial);
      
      if (selectedOffer) {
        setOffers(offers.map(o => o.id === selectedOffer.id ? {
          ...o,
          ...data,
          produit_nom: selectedProduct.name,
          produit_prix_initial: selectedProduct.prix_initial,
          pourcentage_reduction: pourcentageReduction,
        } : o));
      } else {
        const newOffer: Offer = {
          ...data,
          id: offers.length + 1,
          status: "Active",
          produit_nom: selectedProduct.name,
          produit_prix_initial: selectedProduct.prix_initial,
          pourcentage_reduction: pourcentageReduction,
        };
        setOffers([...offers, newOffer]);
      }
    }
    setSelectedOffer(null);
    setIsAddModalOpen(false);
    reset();
  };

  const handleCheckboxChange = (offerId: number) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const filterAndSortOffers = useCallback((offers: Offer[]) => {
    return offers
      .filter(offer =>
        searchTerm === "" ||
        offer.produit_nom.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          return b.date_expiration.getTime() - a.date_expiration.getTime();
        } else if (filterOption === "price") {
          return parseInt(b.prix_offre.replace(/[^0-9]/g, "")) - parseInt(a.prix_offre.replace(/[^0-9]/g, ""));
        } else if (filterOption === "reduction") {
          return b.pourcentage_reduction - a.pourcentage_reduction;
        }
        return 0;
      });
  }, [filterOption, searchTerm]);

  useEffect(() => {
    setFilteredOffers(filterAndSortOffers(offers));
  }, [offers, filterAndSortOffers]);

  return (
    <div className="p-6 space-y-6 bg-night-blue text-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Offres</h1>
          <p className="text-text-secondary mt-2">
            Gérer vos offres promotionnelles et suivez leurs performances.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Rechercher une offre..." 
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
          <SelectContent className="bg-night-blue text-text-primary">
            <SelectItem value="date">Date d&apos;expiration</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
            <SelectItem value="reduction">Réduction</SelectItem>
          </SelectContent>
        </Select>
        {selectedOffers.length > 0 && (
          <Button 
            onClick={handleMultipleDelete}
            className="bg-red-500 hover:bg-red-400"
          >
            Supprimer la sélection ({selectedOffers.length})
          </Button>
        )}
        
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-light-blue text-night-blue hover:bg-light-blue/90 ml-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une Offre
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-text-secondary">Produit</TableHead>
            <TableHead className="text-text-secondary">Prix Initial</TableHead>
            <TableHead className="text-text-secondary">Prix Offre</TableHead>
            <TableHead className="text-text-secondary">Réduction</TableHead>
            <TableHead className="text-text-secondary">Stock</TableHead>
            <TableHead className="text-text-secondary">Date d&apos;expiration</TableHead>
            <TableHead className="text-text-secondary">Statut</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOffers
              .slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage)
              .map((offer) => (
              <TableRow key={offer.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOffers.includes(offer.id)}
                  onCheckedChange={() => handleCheckboxChange(offer.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{offer.produit_nom}</TableCell>
              <TableCell>{offer.produit_prix_initial}</TableCell>
              <TableCell>{offer.prix_offre}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-blue-500">
                  -{offer.pourcentage_reduction}%
                </Badge>
              </TableCell>
              <TableCell>{offer.stock}</TableCell>
              <TableCell>{format(offer.date_expiration, "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <Badge
                  variant={offer.status === "Active" ? "default" : "destructive"}
                  className={offer.status === "Active" ? "bg-green-500" : "bg-red-500"}
                >
                  {offer.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-400"
                  onClick={() => handleEdit(offer)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleDeleteConfirmation(offer.id)}
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
          className="bg-dark-blue text-text-primary hover:bg-dark-blue/90" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Précédent
        </Button>
        <span className="text-sm text-text-secondary">
          Page {currentPage} de {Math.ceil(filteredOffers.length / offersPerPage)}
        </span>
        <Button 
          className="bg-dark-blue text-text-primary hover:bg-dark-blue/90" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOffers.length / offersPerPage)))} 
          disabled={currentPage === Math.ceil(filteredOffers.length / offersPerPage)}
        >
          Suivant
        </Button>
      </div>

      <Dialog open={isAddModalOpen || !!selectedOffer} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setSelectedOffer(null);
        }
      }}>
        <DialogContent className="bg-night-blue text-text-primary">
          <DialogHeader>
            <DialogTitle>{selectedOffer ? "Modifier l'Offre" : "Ajouter une Offre"}</DialogTitle>
            <DialogDescription className="text-text-secondary">
              {selectedOffer ? "Modifiez les informations de l'offre." : "Remplissez les informations ci-dessous pour ajouter une offre."}
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
                      {product.name} - Prix: {product.prix_initial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.produit && <p className="text-red-500">{errors.produit.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix_offre">Prix de l&apos;offre</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <Input 
                    id="prix_offre" 
                    type="number"
                    {...register("prix_offre")} 
                    placeholder="Prix de l'offre" 
                    className="pl-10 bg-dark-blue text-text-primary border-dark-blue" 
                  />
                </div>
                {errors.prix_offre && <p className="text-red-500">{errors.prix_offre.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <Input 
                    id="stock" 
                    {...register("stock", { valueAsNumber: true })} 
                    type="number" 
                    placeholder="Quantité en stock" 
                    className="pl-10 bg-dark-blue text-text-primary border-dark-blue" 
                  />
                </div>
                {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_expiration">Date d&apos;expiration</Label>
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-dark-blue text-text-primary border-dark-blue",
                      !watch("date_expiration") && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {watch("date_expiration") ? 
                      format(watch("date_expiration"), "dd/MM/yyyy", { locale: fr }) : 
                      <span>Choisir une date</span>
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={watch("date_expiration")}
                    onSelect={(date) => {
                      if (date) {
                        setValue("date_expiration", date);
                        setIsDatePopoverOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date_expiration && <p className="text-red-500">{errors.date_expiration.message}</p>}
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                className="bg-gray-100 text-gray-800" 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedOffer(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-light-blue text-night-blue hover:bg-light-blue/90">
                {selectedOffer ? "Modifier" : "Ajouter"}
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
              Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              className="bg-gray-100 text-gray-800" 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-400">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

