/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard/vendeur/produits/page.tsx
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
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Plus, Edit2, Trash2, Star, Package, Banknote, BarChart2, Calendar, ImageIcon } from 'lucide-react';
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.string().min(1, "Le prix est requis"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  category: z.string().min(1, "La catégorie est requise"),
  date: z.date(),
  images: z.array(z.object({
    file: z.instanceof(File)
      .refine(file => file.size <= MAX_FILE_SIZE, `La taille maximale du fichier est de 5MB.`)
      .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), "Seuls les formats .jpg, .jpeg, .png et .webp sont supportés.")
  })).min(1, "Au moins une image est requise"),
  coverImageIndex: z.number().min(0, "Une image de couverture doit être sélectionnée"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product extends Omit<ProductFormData, 'images'> {
  id: number;
  status: "Actif" | "Inactif";
  quality: number;
  images: string[];
  coverImage: string;
  coverImageIndex: number;
}

const categories = [
  "Électroniques",
  "Sports et Loisirs",
  "Maison et Décoration",
  "Mode et Accessoires",
  "Alimentation et Boissons",
  "Automobile",
  "Santé et Beauté",
  "Services",
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Produit A",
    description: "Description du produit A",
    price: "10,000 Ar",
    stock: 25,
    status: "Actif",
    quality: 4.5,
    category: "Électroniques",
    date: new Date("2024-01-01"),
    images: ["/placeholder.svg"],
    coverImage: "/placeholder.svg",
    coverImageIndex: 0,
  },
  {
    id: 2,
    name: "Produit B",
    description: "Description du produit B",
    price: "15,000 Ar",
    stock: 10,
    status: "Inactif",
    quality: 3.8,
    category: "Maison et Décoration",
    date: new Date("2024-01-10"),
    images: ["/placeholder.svg"],
    coverImage: "/placeholder.svg",
    coverImageIndex: 0,
  },
  {
    id: 3,
    name: "Produit C",
    description: "Description du produit C",
    price: "8,500 Ar",
    stock: 50,
    status: "Actif",
    quality: 4.2,
    category: "Mode et Accessoires",
    date: new Date("2024-01-15"),
    images: ["/placeholder.svg"],
    coverImage: "/placeholder.svg",
    coverImageIndex: 0,
  },
];

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [filterOption, setFilterOption] = useState<string>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false); // Added state for date popover
  const productsPerPage = 5;

  const { register, handleSubmit, formState: { errors }, setValue, reset, control, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
      coverImageIndex: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const watchImages = watch("images");
  const watchCoverImageIndex = watch("coverImageIndex");

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    reset({
      ...product,
      images: product.images.map(imageUrl => ({ file: new File([], imageUrl.split('/').pop() || '') })),
      coverImageIndex: product.coverImageIndex,
    });
  };

  const handleDeleteConfirmation = (productId: number) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete !== null) {
      setProducts(products.filter((product) => product.id !== productToDelete));
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleMultipleDelete = () => {
    setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
    setSelectedProducts([]);
  };

  const handleSave = (data: ProductFormData) => {
    const imageUrls = data.images.map(image => {
      if (image.file instanceof File) {
        return URL.createObjectURL(image.file);
      }
      return image.file;
    });
    if (selectedProduct) {
      setProducts(products.map(p => p.id === selectedProduct.id ? {
        ...p,
        ...data,
        images: imageUrls,
        coverImage: imageUrls[data.coverImageIndex] || imageUrls[0],
      } : p));
    } else {
      const newProduct: Product = {
        ...data,
        id: products.length + 1,
        status: "Actif",
        quality: 0,
        images: imageUrls,
        coverImage: imageUrls[data.coverImageIndex] || imageUrls[0],
        coverImageIndex: data.coverImageIndex,
      };
      setProducts([...products, newProduct]);
    }
    setSelectedProduct(null);
    setIsAddModalOpen(false);
    reset();
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
    reset();
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filterAndSortProducts = (products: Product[]) => {
    return products
      .filter(product =>
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          return b.date.getTime() - a.date.getTime();
        } else if (filterOption === "price") {
          return parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""));
        } else if (filterOption === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  };

  useEffect(() => {
    setFilteredProducts(filterAndSortProducts(products));
  }, [products, searchTerm, filterOption]);

  return (
    <div className="p-6 space-y-6 bg-night-blue text-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <p className="text-text-secondary mt-2">
            Gérer vos produits et améliorer leur visibilité.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Rechercher un produit..." 
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
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
            <SelectItem value="name">Nom</SelectItem>
          </SelectContent>
        </Select>
        {selectedProducts.length > 0 && (
          <Button 
            onClick={handleMultipleDelete}
            className="bg-red-500 hover:bg-red-400"
          >
            Supprimer la sélection ({selectedProducts.length})
          </Button>
        )}
        
        <Button 
          onClick={handleAddProduct}
          className="bg-light-blue text-night-blue hover:bg-light-blue/90 ml-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter un Produit
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="text-text-secondary">Image</TableHead>
            <TableHead className="text-text-secondary">Nom</TableHead>
            <TableHead className="text-text-secondary">Description</TableHead>
            <TableHead className="text-text-secondary">Prix</TableHead>
            <TableHead className="text-text-secondary">Stock</TableHead>
            <TableHead className="text-text-secondary">Qualité</TableHead>
            <TableHead className="text-text-secondary">Catégorie</TableHead>
            <TableHead className="text-text-secondary">Date</TableHead>
            <TableHead className="text-text-secondary">Statut</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts
              .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
              .map((product) => (
              <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleCheckboxChange(product.id)}
                />
              </TableCell>
              <TableCell>
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded cursor-pointer"
                  onClick={() => {
                    setPreviewImage(product.coverImage);
                    setIsImagePreviewOpen(true);
                  }}
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <span className="text-yellow-500 flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-current" /> {product.quality}
                </span>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{format(product.date, "dd/MM/yyyy")}</TableCell>
              <TableCell>
                <Badge
                  variant={product.status === "Actif" ? "default" : "destructive"}
                  className={product.status === "Actif" ? "bg-green-500" : "bg-red-500"}
                >
                  {product.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-400"
                  onClick={() => handleEdit(product)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-400"
                  onClick={() => handleDeleteConfirmation(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-6">
        <Button className="bg-dark-blue text-text-primary hover:bg-dark-blue/90" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Précédent
        </Button>
        <span className="text-sm text-text-secondary">
          Page {currentPage} de {Math.ceil(filteredProducts.length / productsPerPage)}
        </span>
        <Button className="bg-dark-blue text-text-primary hover:bg-dark-blue/90" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>
          Suivant
        </Button>
      </div>

      <Dialog open={isAddModalOpen || !!selectedProduct} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="bg-night-blue text-text-primary max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Modifier le Produit" : "Ajouter un Produit"}</DialogTitle>
            <DialogDescription className="text-text-secondary">
              {selectedProduct ? "Modifiez les informations du produit." : "Remplissez les informations ci-dessous pour ajouter un produit."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4 mt-4 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" {...register("name")} placeholder="Nom du produit" className="bg-dark-blue text-text-primary border-dark-blue" />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger id="category" className="bg-dark-blue text-text-primary border-dark-blue">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-night-blue text-text-primary">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} placeholder="Description du produit" className="bg-dark-blue text-text-primary border-dark-blue" />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <Input id="price" {...register("price")} type="text" placeholder="Prix" className="pl-10 bg-dark-blue text-text-primary border-dark-blue" />
                </div>
                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                  <Input id="stock" {...register("stock", { valueAsNumber: true })} type="number" placeholder="Quantité en stock" className="pl-10 bg-dark-blue text-text-primary border-dark-blue" />
                </div>
                {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}> {/* Updated Popover */}
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-dark-blue text-text-primary border-dark-blue",
                        !watch("date") && "text-muted-foreground"
                      )}
                      onClick={() => setIsDatePopoverOpen(true)}
                      //{/* Added onClick handler */}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watch("date") ? format(watch("date"), "dd/MM/yyyy", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watch("date")}
                      onSelect={useCallback((date: Date | undefined) => {
                        if (date) {
                          setValue("date", date);
                          setIsDatePopoverOpen(false); // Close popover after selection
                        }
                      }, [setValue])} 
                      //{/* Updated onSelect */}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-red-500">{errors.date.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Images du produit</Label>
              <div className="grid grid-cols-5 gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <img
                      src={URL.createObjectURL(watchImages[index].file)}
                      alt={`Image ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <div className="mt-1 flex items-center">
                      <Checkbox
                        checked={watchCoverImageIndex === index}
                        onCheckedChange={() => setValue("coverImageIndex", index)}
                        className="h-3 w-3"
                      />
                      <Label className="ml-1 text-xs">Couverture</Label>
                    </div>
                  </div>
                ))}
                {fields.length < 5 && (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach(file => {
                          if (fields.length < 5) {
                            append({ file });
                          }
                        });
                      }}
                      className="hidden"
                      id={`image-upload-${fields.length}`}
                    />
                    <Label
                      htmlFor={`image-upload-${fields.length}`}
                      className="flex items-center justify-center w-full h-20 border-2 border-dashed rounded-md cursor-pointer hover:border-primary"
                    >
                      <ImageIcon className="w-6 h-6" />
                    </Label>
                  </div>
                )}
              </div>
              {errors.images && <p className="text-red-500">{errors.images.message}</p>}
            </div>
            <DialogFooter className="mt-6 sticky bottom-0 bg-night-blue py-4 border-t border-gray-800">
              <Button type="button" className="bg-gray-100 text-gray-800" variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setSelectedProduct(null);
              }}>
                Annuler
              </Button>
              <Button type="submit" className="bg-light-blue text-night-blue hover:bg-light-blue/90">
                {selectedProduct ? "Modifier" : "Ajouter"}
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
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button className="bg-gray-100 text-gray-800" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-400">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="bg-night-blue text-text-primary p-0 max-w-6xl w-screen h-screen ">
          <DialogTitle className="sr-only">Aperçu de l&apos;image</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Aperçu" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-text-secondary text-xl">Aucune image</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

