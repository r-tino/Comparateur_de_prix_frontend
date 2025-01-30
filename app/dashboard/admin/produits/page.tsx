/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard/admin/produits/pages.tsx

"use client"

import { useState, useEffect } from "react";
import { format, isValid } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Package,
  Banknote,
  BarChart2,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduitStore, useAuthStore, useCategorieStore } from "@/store";
import { ImageIcon } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.string().min(1, "Le prix est requis"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  category: z.string().min(1, "La catégorie est requise"),
  images: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, `La taille maximale du fichier est de 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Seuls les formats .jpg, .jpeg, .png et .webp sont supportés."
          ),
      })
    )
    .min(1, "Au moins une image est requise"),
  coverImageIndex: z.number().min(0, "Une image de couverture doit être sélectionnée"),
  attributes: z.record(z.string().min(1, "La valeur de l'attribut est requise")),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product extends Omit<ProductFormData, "images" | "category"> {
  id_Produit: string;
  nom_Produit: string;
  description: string;
  prixInitial: number;
  stock: number;
  qualiteMoyenne: number;
  datePublication: Date;
  disponibilite: boolean;
  categorieId: string;
  category?: {
    id_Categorie: string;
    nomCategorie: string;
  };
  images: string[];
  coverImage: string;
  coverImageIndex: number;
  valeursAttributs: Record<string, string>;
  utilisateur: {
    id_User: string;
    nom_user: string;
    email: string;
    role: string;
  };
}

interface Category {
  id_Categorie: string;
  nomCategorie: string;
  attributs: Array<{ id_Attribut: string; nomAttribut: string }>;
}

export default function ProductsPage() {
  const { produitData, fetchProduits, addProduit, updateProduit, deleteProduit } = useProduitStore();
  const { auth } = useAuthStore();
  const { categorieData, fetchCategories } = useCategorieStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMultipleDeleteModalOpen, setIsMultipleDeleteModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string>("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(produitData);
  const [, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const productsPerPage = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: [],
      coverImageIndex: 0,
      attributes: {},
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
    setSelectedCategory(product.category?.nomCategorie);
    reset({
      name: product.nom_Produit,
      description: product.description,
      price: product.prixInitial.toString(),
      stock: product.stock,
      category: product.category?.nomCategorie || '',
      images: product.images.map((imageUrl) => ({ file: new File([], imageUrl.split("/").pop() || "") })),
      coverImageIndex: product.coverImageIndex,
      attributes: product.valeursAttributs || {},
    });
  };

  const handleDeleteConfirmation = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (productToDelete !== null) {
      await deleteProduit(productToDelete);
      fetchProduits(currentPage, productsPerPage);
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleMultipleDelete = async () => {
    await Promise.all(selectedProducts.map((id) => deleteProduit(id)));
    setSelectedProducts([]);
    fetchProduits(currentPage, productsPerPage);
  };

  const uploadImageToServer = async (file: File) => {
    // Mocking the upload function - Replace with actual Cloudinary upload logic
    return new Promise<{ url: string }>((resolve) => {
      setTimeout(() => {
        resolve({ url: URL.createObjectURL(file) });
      }, 1000);
    });
  };

  const handleSave = async (data: ProductFormData) => {
    try {
      if (!data.name || !data.description || !data.price || data.stock === undefined || !data.category || data.images.length === 0) {
        throw new Error("Les champs requis sont manquants.");
      }
  
      const imageUrls = await Promise.all(
        data.images.map(async (image) => {
          if (image.file instanceof File) {
            const result = await uploadImageToServer(image.file);
            return result.url;
          }
          return image.file;
        })
      );
  
      const currentUser = {
        id: auth.user.id_User,
        name: auth.user.nom_user,
        email: auth.user.email,
        role: auth.user.role,
      };
  
      const selectedCategory = categorieData?.find((cat: Category) => cat.nomCategorie === data.category);
      const categorieId = selectedCategory ? selectedCategory.id_Categorie : null;
  
      if (!categorieId) {
        throw new Error("Catégorie invalide sélectionnée");
      }
  
      interface ProductData {
        nom_Produit: string;
        description: string;
        prixInitial: number;
        stock: number;
        categorieId: string;
        photos: { url: string; couverture: boolean }[];
        valeursAttributs: Record<string, string>;
        disponibilite: boolean;
      }
  
      const productData: ProductData = {
        nom_Produit: data.name,
        description: data.description,
        prixInitial: parseFloat(data.price.replace(/[^0-9.]/g, "")),
        stock: data.stock,
        categorieId: categorieId,
        photos: imageUrls.map((url, index) => ({
          url,
          couverture: index === data.coverImageIndex,
        })),
        valeursAttributs: data.attributes,
        disponibilite: true,
      };
  
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === "photos") {
          productData.photos.forEach((photo, index) => {
            formData.append(`photos[${index}][url]`, photo.url);
            formData.append(`photos[${index}][couverture]`, photo.couverture.toString());
          });
        } else if (key === "valeursAttributs") {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          const value = productData[key as keyof ProductData];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      });
  
      if (selectedProduct) {
        await updateProduit(selectedProduct.id_Produit, formData);
      } else {
        await addProduit(formData, currentUser.id);
      }
      setSelectedProduct(null);
      setIsAddModalOpen(false);
      fetchProduits(currentPage, productsPerPage);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
    }
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
    reset({
      images: [],
      coverImageIndex: -1,
      attributes: {},
    });
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const filterAndSortProducts = (products: Product[]) => {
    return products
      .filter(
        (product) =>
          searchTerm === "" ||
          product.nom_Produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          const dateA = new Date(a.datePublication);
          const dateB = new Date(b.datePublication);
          if (isValid(dateA) && isValid(dateB)) {
            return dateB.getTime() - dateA.getTime();
          }
          return 0;
        } else if (filterOption === "price") {
          return b.prixInitial - a.prixInitial;
        } else if (filterOption === "name") {
          return a.nom_Produit.localeCompare(b.nom_Produit);
        }
        return 0;
      });
  };

  useEffect(() => {
    fetchProduits(currentPage, productsPerPage);
    fetchCategories();
  }, [currentPage, productsPerPage, fetchProduits, fetchCategories]);

  useEffect(() => {
    console.log(produitData); // Vérifiez les données des produits ici
    setFilteredProducts(filterAndSortProducts(produitData));
  }, [produitData, searchTerm, filterOption]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const getCategoryAttributes = (category: string) => {
    const selectedCat = categorieData?.find((cat: Category) => cat.nomCategorie === category);
    return selectedCat ? selectedCat.attributs : [];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"
    >
      <motion.div
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
            Gestion des Produits
          </h1>
          <p className="text-gray-600 mt-2">Gérer et organiser les produits de votre plateforme e-commerce</p>
        </div>
      </motion.div>

      <Card className="bg-white/80 backdrop-filter backdrop-blur-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Liste des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex flex-wrap items-center gap-4 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger id="category" className="w-[180px] bg-white border-gray-300">
                <BarChart2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="date">Date de création</SelectItem>
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
            {selectedProducts.length > 0 && (
              <Button
                onClick={() => setIsMultipleDeleteModalOpen(true)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 transition-colors duration-300"
              >
                Supprimer la sélection ({selectedProducts.length})
              </Button>
            )}
            <Button
              onClick={handleAddProduct}
              className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
            >
              <Plus className="mr-2 h-4 w-4" /> Ajouter un Produit
            </Button>
          </motion.div>
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b border-gray-200">
                  <TableHead className="w-[50px] py-4"></TableHead>
                  <TableHead className="text-text-secondary">Image</TableHead>
                  <TableHead className="text-text-secondary">Nom</TableHead>
                  <TableHead className="text-text-secondary">Description</TableHead>
                  <TableHead className="text-text-secondary">Prix</TableHead>
                  <TableHead className="text-text-secondary">Stock</TableHead>
                  <TableHead className="text-text-secondary">Qualité</TableHead>
                  <TableHead className="text-text-secondary">Catégorie</TableHead>
                  <TableHead className="text-text-secondary">Propriétaire</TableHead>
                  <TableHead className="text-text-secondary">Date</TableHead>
                  <TableHead className="text-text-secondary">Statut</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredProducts
                    .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                    .map((product) => (
                      <motion.tr
                        key={`product-${product?.id_Produit}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product?.id_Produit)}
                            onCheckedChange={() => handleCheckboxChange(product?.id_Produit)}
                          />
                        </TableCell>
                        <TableCell>
                          <Image
                            src={product?.coverImage || "/placeholder.svg"}
                            alt={product?.nom_Produit || "Image"}
                            width={40}
                            height={40}
                            className="object-cover rounded cursor-pointer"
                            onClick={() => {
                              setPreviewImage(product?.coverImage);
                              setIsImagePreviewOpen(true);
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product?.nom_Produit}</TableCell>
                        <TableCell>{product?.description}</TableCell>
                        <TableCell>{product?.prixInitial}</TableCell>
                        <TableCell>{product?.stock}</TableCell>
                        <TableCell>
                          <span className="text-yellow-500 flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-current" /> {product?.qualiteMoyenne}
                          </span>
                        </TableCell>
                        <TableCell>{product?.category ? product.category.nomCategorie : 'Catégorie non définie'}</TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <span className="font-medium">{product?.utilisateur ? product.utilisateur.nom_user : 'Utilisateur non défini'}</span>
                            <span className="text-sm text-text-secondary">{product?.utilisateur ? product.utilisateur.email : ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isValid(new Date(product?.datePublication))
                            ? format(new Date(product?.datePublication), "dd/MM/yyyy")
                            : "Date invalide"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product?.disponibilite ? "default" : "secondary"}
                            className={product?.disponibilite ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {product?.disponibilite ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-yellow-600 hover:text-yellow-700 border-yellow-600 hover:border-yellow-700 transition-colors duration-300"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteConfirmation(product?.id_Produit)}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {Math.ceil(filteredProducts.length / productsPerPage)}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))
              }
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              className="bg-white hover:bg-gray-100 transition-colors duration-300"
            >
              Suivant
              <ChevronUp className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAddModalOpen || !!selectedProduct}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setSelectedProduct(null);
            setSelectedCategory(undefined);
          }
        }}
      >
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {selectedProduct ? "Modifier le Produit" : "Ajouter un Produit"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedProduct
                ? "Modifiez les informations du produit existant."
                : "Remplissez les informations ci-dessous pour ajouter un nouveau produit."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom du produit
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Nom du produit"
                    className="mt-1 bg-white/50 backdrop-filter backdrop-blur-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Catégorie
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                      setValue("category", value);
                      setSelectedCategory(value);
                    }}
                  >
                    <SelectTrigger id="category" className="mt-1 bg-white/50 backdrop-filter backdrop-blur-sm">
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900">
                      {categorieData?.map((category: Category) => (
                        <SelectItem key={category.id_Categorie} value={category.nomCategorie}>
                          {category.nomCategorie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Description du produit"
                    className="mt-1 bg-white/50 backdrop-filter backdrop-blur-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    rows={4}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Prix
                  </Label>
                  <div className="relative mt-1">
                    <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="price"
                      {...register("price")}
                      placeholder="Prix"
                      className="pl-10 bg-white/50 backdrop-filter backdrop-blur-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                    Stock
                  </Label>
                  <div className="relative mt-1">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="stock"
                      {...register("stock", { valueAsNumber: true })}
                      type="number"
                      placeholder="Quantité en stock"
                      className="pl-10 bg-white/50 backdrop-filter backdrop-blur-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                    />
                  </div>
                  {errors.stock && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
                </div>
                {selectedCategory &&
                  getCategoryAttributes(selectedCategory).map(
                    (attribute: { id_Attribut: string; nomAttribut: string }) => (
                      <div key={`attribute-${attribute.id_Attribut}`}>
                        <Label
                          htmlFor={`attribute-${attribute.id_Attribut}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          {attribute.nomAttribut}
                        </Label>
                        <Input
                          id={`attribute-${attribute.id_Attribut}`}
                          {...register(`attributes.${attribute.nomAttribut}`)}
                          placeholder={attribute.nomAttribut}
                          className="mt-1 bg-white/50 backdrop-filter backdrop-blur-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300"
                        />
                        {errors.attributes && errors.attributes[attribute.nomAttribut] && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.attributes[attribute.nomAttribut]?.message}
                          </p>
                        )}
                      </div>
                    ),
                  )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-2">Images du produit</Label>
              <div className="grid grid-cols-5 gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <Image
                      src={URL.createObjectURL(watchImages[index].file) || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-md shadow-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg"
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
                        files.forEach((file) => {
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
                      className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
                    >
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </Label>
                  </div>
                )}
              </div>
              {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>}
            </div>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="bg-white hover:bg-gray-100 text-gray-800 transition-all duration-300"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {selectedProduct ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMultipleDeleteModalOpen} onOpenChange={setIsMultipleDeleteModalOpen}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression multiple</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer les produits sélectionnés ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsMultipleDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleMultipleDelete();
                setIsMultipleDeleteModalOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg p-0 max-w-3xl w-full h-full">
          <DialogTitle className="sr-only">Aperçu de l&apos;image</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Aperçu"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-gray-500 text-xl">Aucune image</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}