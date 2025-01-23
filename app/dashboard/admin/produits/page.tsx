/* eslint-disable react-hooks/exhaustive-deps */
// app/dashboard/admin/produits/pages.tsx

"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Package,
  Banknote,
  BarChart2,
  Calendar,
  ImageIcon,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Image from "next/image"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProduitStore, useAuthStore, useCategorieStore } from "@/store" // Importer les stores

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.string().min(1, "Le prix est requis"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  category: z.string().min(1, "La catégorie est requise"),
  date: z.date(),
  images: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, `La taille maximale du fichier est de 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Seuls les formats .jpg, .jpeg, .png et .webp sont supportés.",
          ),
      }),
    )
    .min(1, "Au moins une image est requise"),
  coverImageIndex: z.number().min(0, "Une image de couverture doit être sélectionnée"),
  attributes: z.record(z.string().min(1, "La valeur de l'attribut est requise")),
})

type ProductFormData = z.infer<typeof productSchema>

interface Product extends Omit<ProductFormData, "images"> {
  id: number
  status: "Actif" | "Inactif"
  quality: number
  images: string[]
  coverImage: string
  coverImageIndex: number
  owner: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface Category {
  id_Categorie: string
  nomCategorie: string
  attributs: Array<{ id_Attribut: string; nomAttribut: string }>
}

export default function ProductsPage() {
  const { produitData, fetchProduits, addProduit, updateProduit, deleteProduit } = useProduitStore()
  const { auth } = useAuthStore()
  const { categorieData, fetchCategories } = useCategorieStore()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isMultipleDeleteModalOpen, setIsMultipleDeleteModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [filterOption, setFilterOption] = useState<string>("date")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(produitData)
  const [, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const productsPerPage = 5

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
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  const watchImages = watch("images")
  const watchCoverImageIndex = watch("coverImageIndex")

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setSelectedCategory(product.category)
    reset({
      ...product,
      images: product.images.map((imageUrl) => ({ file: new File([], imageUrl.split("/").pop() || "") })),
      coverImageIndex: product.coverImageIndex,
      attributes: product.attributes || {},
    })
  }

  const handleDeleteConfirmation = (productId: number) => {
    setProductToDelete(productId)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (productToDelete !== null) {
      await deleteProduit(productToDelete)
      fetchProduits(currentPage, productsPerPage)
    }
    setIsDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleMultipleDelete = async () => {
    await Promise.all(selectedProducts.map((id) => deleteProduit(id)))
    setSelectedProducts([])
    fetchProduits(currentPage, productsPerPage)
  }

  const uploadImageToServer = async (file: File) => {
    // Mocking the upload function
    return new Promise<{ url: string }>((resolve) => {
      setTimeout(() => {
        resolve({ url: URL.createObjectURL(file) });
      }, 1000);
    });
  };

  const handleSave = async (data: ProductFormData) => {
    try {
      const imageUrls = await Promise.all(data.images.map(async (image) => {
        if (image.file instanceof File) {
          const result = await uploadImageToServer(image.file);
          return result.url;
        }
        return image.file;
      }));
  
      const currentUser = {
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        role: auth.user.role,
      };
  
      const productData = {
        nom_Produit: data.name, // Assurez-vous que le nom est une chaîne de caractères
        description: data.description,
        prixInitial: parseFloat(data.price.replace(/[^0-9.]/g, '')), // Convertir le prix en nombre
        stock: data.stock,
        categorieId: data.category,
        date: data.date,
        photos: imageUrls.map((url, index) => ({
          url,
          couverture: index === data.coverImageIndex,
        })), // Assurez-vous qu'il y a au moins une image
        attributs: data.attributes,
        status: selectedProduct ? selectedProduct.status : "Actif",
        quality: selectedProduct ? selectedProduct.quality : 0,
        owner: currentUser,
      };
  
      if (selectedProduct) {
        await updateProduit(selectedProduct.id, productData);
      } else {
        await addProduit(productData);
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
    setIsAddModalOpen(true)
    reset({
      images: [],
      coverImageIndex: -1,
      attributes: {},
    })
  }

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const filterAndSortProducts = (products: Product[]) => {
    return products
      .filter(
        (product) =>
          searchTerm === "" ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (filterOption === "date") {
          return b.date.getTime() - a.date.getTime()
        } else if (filterOption === "price") {
          return Number.parseInt(b.price.replace(/[^0-9]/g, "")) - Number.parseInt(a.price.replace(/[^0-9]/g, ""))
        } else if (filterOption === "name") {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
  }

  useEffect(() => {
    fetchProduits(currentPage, productsPerPage)
    fetchCategories()
  }, [currentPage, productsPerPage, fetchProduits, fetchCategories])

  useEffect(() => {
    setFilteredProducts(filterAndSortProducts(produitData))
  }, [produitData, searchTerm, filterOption])

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"))
  }

  const getCategoryAttributes = (category: string) => {
    const selectedCat = categorieData.find((cat: Category) => cat.nomCategorie === category)
    return selectedCat ? selectedCat.attributs : []
  }

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
              <SelectTrigger className="w-[180px] bg-white border-gray-300">
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
                        key={`product-${product?.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product?.id)}
                            onCheckedChange={() => handleCheckboxChange(product?.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Image
                            src={product?.coverImage || "/placeholder.svg"}
                            alt={product?.name || "Image"}
                            width={40}
                            height={40}
                            className="object-cover rounded cursor-pointer"
                            onClick={() => {
                              setPreviewImage(product?.coverImage)
                              setIsImagePreviewOpen(true)
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product?.name}</TableCell>
                        <TableCell>{product?.description}</TableCell>
                        <TableCell>{product?.price}</TableCell>
                        <TableCell>{product?.stock}</TableCell>
                        <TableCell>
                          <span className="text-yellow-500 flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-current" /> {product?.quality}
                          </span>
                        </TableCell>
                        <TableCell>{product?.category}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product?.owner?.name}</span>
                            <span className="text-sm text-text-secondary">{product?.owner?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(product?.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={product?.status === "Actif" ? "default" : "secondary"}
                            className={
                              product?.status === "Actif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {product?.status}
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
                              onClick={() => handleDeleteConfirmation(product?.id)}
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
            setIsAddModalOpen(false)
            setSelectedProduct(null)
            setSelectedCategory(undefined)
          }
        }}
      >
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Modifier le Produit" : "Ajouter un Produit"}</DialogTitle>
            <DialogDescription className="text-text-secondary">
              {selectedProduct
                ? "Modifiez les informations du produit."
                : "Remplissez les informations ci-dessous pour ajouter un produit."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4 mt-4 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input id="name" {...register("name")} placeholder="Nom du produit" className="bg-white/50" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setValue("category", value)
                    setSelectedCategory(value)
                  }}
                >
                  <SelectTrigger id="category" className="bg-white/50">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-night-blue text-text-primary">
                    {categorieData.map((category: Category) => (
                      <SelectItem key={category.id_Categorie} value={category.nomCategorie}>
                        {category.nomCategorie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Description du produit"
                className="bg-white/50"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix</Label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input id="price" {...register("price")} placeholder="Prix" className="pl-10 bg-white/50" />
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="stock"
                    {...register("stock", { valueAsNumber: true })}
                    type="number"
                    placeholder="Quantité en stock"
                    className="pl-10 bg-white/50"
                  />
                </div>
                {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/50",
                        !watch("date") && "text-muted-foreground",
                      )}
                      onClick={() => setIsDatePopoverOpen(true)}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {watch("date") ? (
                        format(watch("date"), "dd/MM/yyyy", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={watch("date")}
                      onSelect={(date) => {
                        if (date) {
                          setValue("date", date)
                          setIsDatePopoverOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
              </div>
            </div>

            {selectedCategory &&
              getCategoryAttributes(selectedCategory).map((attribute: { id_Attribut: string; nomAttribut: string }) => (
                <div key={`attribute-${attribute.id_Attribut}`} className="space-y-2">
                  <Label htmlFor={`attribute-${attribute.id_Attribut}`}>{attribute.nomAttribut}</Label>
                  <Input
                    id={`attribute-${attribute.id_Attribut}`}
                    {...register(`attributes.${attribute.nomAttribut}`)}
                    placeholder={attribute.nomAttribut}
                    className="bg-white/50"
                  />
                  {errors.attributes && errors.attributes[attribute.nomAttribut] && (
                    <p key={`error-${attribute.id_Attribut}`} className="text-sm text-red-500">
                      {errors.attributes[attribute.nomAttribut]?.message}
                    </p>
                  )}
                </div>
              ))}

            <div className="space-y-2">
              <Label>Images du produit</Label>
              <div className="grid grid-cols-5 gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <Image
                      src={URL.createObjectURL(watchImages[index].file) || "/placeholder.svg"}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
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
                        const files = Array.from(e.target.files || [])
                        files.forEach((file) => {
                          if (fields.length < 5) {
                            append({ file })
                          }
                        })
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
              {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
            </div>
            <DialogFooter className="mt-6 sticky bottom-0 py-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setSelectedProduct(null)
                }}
              >
                Annuler
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                handleMultipleDelete()
                setIsMultipleDeleteModalOpen(false)
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
  )
}