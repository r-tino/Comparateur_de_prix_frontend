/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/admin/offres/pages.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Search, Plus, Edit2, Trash2, Package, Banknote, BarChart2, CalendarIcon, ArrowUpDown, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Définition du schéma pour le produit
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Mise à jour du schéma de l'offre
const offerSchema = z.object({
  id: z.string(),
  productId: z.string(),
  prix_Offre: z.number().min(0, "Le prix doit être positif"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  date_Expiration: z.date(),
});

type OfferFormData = z.infer<typeof offerSchema>;

interface Offer extends OfferFormData {
  status: "Active" | "Expirée";
  product: { id: string; name: string };
  proprietaire: string;
}

// Simuler une liste de produits
const mockProducts = [
  { id: "P1", name: "Smartphone XYZ" },
  { id: "P2", name: "Tablette ABC" },
  { id: "P3", name: "Écouteurs sans fil" },
];

const mockOffers: Offer[] = [
  {
    id: "1",
    productId: "P1",
    prix_Offre: 15000,
    stock: 10,
    date_Expiration: new Date("2024-02-01"),
    status: "Active",
    product: mockProducts[0],
    proprietaire: "John Doe"
  },
  {
    id: "2",
    productId: "P2",
    prix_Offre: 8000,
    stock: 5,
    date_Expiration: new Date("2024-01-20"),
    status: "Expirée",
    product: mockProducts[1],
    proprietaire: "Jane Smith"
  },
  {
    id: "3",
    productId: "P3",
    prix_Offre: 5000,
    stock: 15,
    date_Expiration: new Date("2024-03-01"),
    status: "Active",
    product: mockProducts[2],
    proprietaire: "Alice Johnson"
  }
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultiDeleteModalOpen, setIsMultiDeleteModalOpen] = useState(false);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>(offers);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const offersPerPage = 5;
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false); // Nouvel état pour le Popover

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema)
  });

  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    reset({
      id: offer.id,
      productId: offer.productId,
      prix_Offre: offer.prix_Offre,
      stock: offer.stock,
      date_Expiration: offer.date_Expiration,
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteConfirmation = (offerId: string) => {
    setOfferToDelete(offerId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (offerToDelete) {
      setOffers(offers.filter((offer) => offer.id !== offerToDelete));
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    }
  };

  const handleMultipleDelete = () => {
    setOffers(offers.filter((offer) => !selectedOffers.includes(offer.id)));
    setSelectedOffers([]);
    setIsMultiDeleteModalOpen(false);
  };

  const handleSave = (data: OfferFormData) => {
    const product = mockProducts.find(p => p.id === data.productId);
    if (!product) return;

    if (selectedOffer) {
      setOffers(offers.map(o => o.id === selectedOffer.id ? {
        ...o,
        ...data,
        product,
        status: data.date_Expiration < new Date() ? "Expirée" : "Active"
      } : o));
    } else {
      const newOffer: Offer = {
        ...data,
        id: `${offers.length + 1}`,
        product,
        status: data.date_Expiration < new Date() ? "Expirée" : "Active",
        proprietaire: "Nouveau Propriétaire" // Simuler l'attribution automatique
      };
      setOffers([...offers, newOffer]);
    }
    setIsAddModalOpen(false);
    setSelectedOffer(null);
    reset();
  };

  const handleAddOffer = () => {
    setIsAddModalOpen(true);
    reset({
      id: "",
      productId: "",
      prix_Offre: 0,
      stock: 0,
      date_Expiration: new Date(),
    });
  };

  const handleCheckboxChange = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const filterAndSortOffers = useCallback(() => {
    return offers
      .filter(offer =>
        searchTerm === "" ||
        offer.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          return sortOrder === 'asc' 
            ? a.date_Expiration.getTime() - b.date_Expiration.getTime()
            : b.date_Expiration.getTime() - a.date_Expiration.getTime();
        } else if (filterOption === "price") {
          return sortOrder === 'asc'
            ? a.prix_Offre - b.prix_Offre
            : b.prix_Offre - a.prix_Offre;
        }
        return 0;
      });
  }, [offers, searchTerm, filterOption, sortOrder]);

  useEffect(() => {
    setFilteredOffers(filterAndSortOffers());
  }, [filterAndSortOffers]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen"
    >
      <motion.div 
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
            Gestion des Offres
          </h1>
          <p className="text-gray-600 mt-2">
            Gérer et organiser les offres de votre plateforme e-commerce
          </p>
        </div>
      </motion.div>

      <Card className="bg-white/80 backdrop-filter backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Liste des Offres</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-wrap items-center gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="w-[180px] bg-white border-gray-300">
                <BarChart2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="date">Date d&apos;expiration</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              className="ml-2 bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            {selectedOffers.length > 0 && (
              <Button
                onClick={() => setIsMultiDeleteModalOpen(true)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 transition-colors duration-300"
              >
                Supprimer la sélection ({selectedOffers.length})
              </Button>
            )}
            <Button 
              onClick={handleAddOffer}
              className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter une Offre
            </Button>
          </motion.div>

          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-indigo-700">Produit</TableHead>
                  <TableHead className="text-indigo-700">Prix de l&apos;offre</TableHead>
                  <TableHead className="text-indigo-700">Stock</TableHead>
                  <TableHead className="text-indigo-700">Date d&apos;expiration</TableHead>
                  <TableHead className="text-indigo-700">Statut</TableHead>
                  <TableHead className="text-indigo-700">Propriétaire</TableHead>
                  <TableHead className="text-indigo-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredOffers
                    .slice((currentPage - 1) * offersPerPage, currentPage * offersPerPage)
                    .map((offer) => (
                    <motion.tr
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedOffers.includes(offer.id)}
                          onCheckedChange={() => handleCheckboxChange(offer.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{offer.product.name}</TableCell>
                      <TableCell>{offer.prix_Offre.toLocaleString()} Ar</TableCell>
                      <TableCell>{offer.stock}</TableCell>
                      <TableCell>{format(offer.date_Expiration, "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <Badge
                          variant={offer.status === "Active" ? "default" : "secondary"}
                          className={offer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{offer.proprietaire}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(offer)}
                            className="text-yellow-600 hover:text-yellow-700 border-yellow-600 hover:border-yellow-700 transition-colors duration-300"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteConfirmation(offer.id)}
                            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 transition-colors duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {Math.ceil(filteredOffers.length / offersPerPage)}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOffers.length / offersPerPage)))} 
              disabled={currentPage === Math.ceil(filteredOffers.length / offersPerPage)}
              className="bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              Suivant
              <ChevronUp className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {(isAddModalOpen || !!selectedOffer) && (
          <Dialog open={true} onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false);
              setSelectedOffer(null);
            }
          }}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedOffer ? "Modifier l&apos;Offre" : "Ajouter une Nouvelle Offre"}</DialogTitle>
                <DialogDescription>
                  {selectedOffer ? "Modifiez les détails de l&apos;offre ici. Cliquez sur enregistrer quand vous avez terminé." : "Ajoutez les détails de la nouvelle offre ici."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleSave)}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="productId" className="text-right">
                      Produit
                    </Label>
                    <Select onValueChange={(value) => setValue("productId", value)} defaultValue={watch("productId")}>
                      <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="prix_Offre" className="text-right">
                      Prix
                    </Label>
                    <Input
                      id="prix_Offre"
                      type="number"
                      className="col-span-3"
                      {...register("prix_Offre", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stock" className="text-right">
                      Stock
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      className="col-span-3"
                      {...register("stock", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date_Expiration" className="text-right">
                      Expiration
                    </Label>
                    <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !watch("date_Expiration") && "text-muted-foreground"
                          )}
                          onClick={() => setIsDatePopoverOpen(true)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch("date_Expiration") ? format(watch("date_Expiration"), "dd MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={watch("date_Expiration")}
                          onSelect={(date) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            date && setValue("date_Expiration", date);
                            setIsDatePopoverOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{selectedOffer ? "Enregistrer les modifications" : "Ajouter l'offre"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <Dialog open={true} onOpenChange={setIsDeleteModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Confirmer la suppression
                </DialogTitle>
                <DialogDescription>
                  Êtes-vous absolument sûr de vouloir supprimer cette offre ? Cette action est irréversible et pourrait avoir des conséquences importantes.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Supprimer définitivement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMultiDeleteModalOpen && (
          <Dialog open={true} onOpenChange={setIsMultiDeleteModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Confirmer la suppression multiple
                </DialogTitle>
                <DialogDescription>
                  Attention ! Vous êtes sur le point de supprimer {selectedOffers.length} offres. Cette action est irréversible et pourrait avoir des conséquences importantes sur votre catalogue.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsMultiDeleteModalOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleMultipleDelete} className="bg-red-600 hover:bg-red-700">
                  Supprimer {selectedOffers.length} offres
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

