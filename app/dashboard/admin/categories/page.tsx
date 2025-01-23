// app/dashboard/admin/categorie/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, BarChart2, ArrowUpDown, ChevronDown, ChevronUp, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { z } from "zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useCategorieStore } from "@/store"; // Utilisation du nouveau store
import { motion, AnimatePresence } from "framer-motion";
// import useFetchCategorie from "@/hooks/categorie.hook";

const parentCategories = [
  "Electroniques", "Sport et loisirs", "Maison et decoration", 
  "Mode et accessoirs", "Alimentation et boissons", "Automobiles", 
  "Sante et beaute", "Service"
];

const attributeSchema = z.object({
  id_Attribut: z.string().optional(), // Ajoutez cette ligne pour inclure la propriété `id`
  key: z.string().min(1, "Le nom de l'attribut est obligatoire"),
  value: z.enum(["text", "number", "date", "boolean"]),
  estObligatoire: z.boolean().default(false),
  typeAttribut: z.string().min(1, "Le type de l'attribut est obligatoire"),
});

const categorySchema = z.object({
  nomCategorie: z.string().min(2, "Le nom de la catégorie doit contenir au moins 2 caractères."),
  isActive: z.boolean().default(true),
  typeCategory: z.string().min(1, "Veuillez sélectionner un type"),
  attributs: z.array(attributeSchema).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id_Categorie: string;
  nomCategorie: string;
  typeCategory: string;
  isActive: boolean;
  createdAt: string;
  productsCount: number;
  attributs?: Record<string, string>;
}

const COLORS = [
  "#3B82F6", "#22C55E", "#F97316", "#8B5CF6", "#EC4899", "#14B8A6", "#F59E0B",
];

export default function CategoriesPage() {
  const { categorieData, fetchCategories, addCategorie, updateCategorie, deleteCategorie } = useCategorieStore(); // Utilisation du nouveau store
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modals, setModals] = useState({
    add: false,
    delete: false,
    multipleDelete: false,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("asc");
  const categoriesPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      typeCategory: "",
      attributs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributs",
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingInitial(true);
      await fetchCategories();
      setIsLoadingInitial(false);
    };
    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const formattedCategories = categorieData.map((category: Category) => ({
      ...category,
      createdAt: category.createdAt ? parseISO(category.createdAt).toISOString() : new Date().toISOString(),
      productsCount: category.productsCount ?? 0, // Assurez-vous que productsCount a une valeur valide
    }));
    console.log("Formatted Categories:", formattedCategories); // Log pour vérifier les données de `formattedCategories`
    setCategories(formattedCategories);
  }, [categorieData]);

  const formattedCategoriesForChart = useMemo(() => {
    const validCategories = categories.filter(category => 
      typeof category.nomCategorie === 'string' && 
      typeof category.productsCount === 'number'
    );
  
    const data = validCategories.length > 0 ? validCategories.map((category) => ({
      name: category.nomCategorie,
      value: category.productsCount || 0,
    })) : [{ name: "Aucune catégorie", value: 1 }];
  
    console.log("Formatted Categories for Chart:", data); // Log pour vérifier les données de `formattedCategoriesForChart`
  
    // Validation des Données
    data.forEach((category) => {
      if (typeof category.name !== 'string' || typeof category.value !== 'number') {
        console.error('Invalid data format:', category);
      }
    });
  
    return data;
  }, [categories]);

  const handleEdit = (category: Category) => {
    const categoryId = category.id_Categorie;

    if (!categoryId) {
      console.error('ID de catégorie non défini dans handleEdit:', category);
      return;
    }

    console.log('Editing category:', category);
    setSelectedCategory({ ...category, id_Categorie: categoryId });

    reset({
      nomCategorie: category.nomCategorie,
      isActive: category.isActive,
      typeCategory: category.typeCategory,
      attributs: category.attributs ? Object.entries(category.attributs).map(([key, value]) => ({
        key,
        value: value as "text" | "number" | "date" | "boolean",
        estObligatoire: false, // ou la valeur appropriée
        typeAttribut: "", // ou la valeur appropriée
      })) : [],
    });
    setModals((prev) => ({ ...prev, add: true }));
  };

  const handleDeleteConfirmation = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setModals((prev) => ({ ...prev, delete: true }));
  };

  const handleDelete = async () => {
    if (categoryToDelete !== null) {
      setIsLoading(true);
      setLoadingAction("delete");
      try {
        await deleteCategorie(categoryToDelete);
        setCategories(categories.filter((category) => category.id_Categorie !== categoryToDelete));
        showAlert('success', 'Catégorie supprimée avec succès');
      } catch (error) {
        console.error("Error deleting category:", error);
        showAlert('error', "Erreur lors de la suppression de la catégorie");
      } finally {
        setIsLoading(false);
        setLoadingAction(null);
      }
    }
    setModals((prev) => ({ ...prev, delete: false }));
    setCategoryToDelete(null);
  };

  const handleMultipleDelete = async () => {
    setIsLoading(true);
    setLoadingAction("multipleDelete");
    try {
      await Promise.all(selectedCategories.map((categoryId) => deleteCategorie(categoryId)));
      setCategories(categories.filter((category) => !selectedCategories.includes(category.id_Categorie)));
      setSelectedCategories([]);
      showAlert('success', 'Catégories supprimées avec succès');
    } catch (error) {
      console.error("Error deleting multiple categories:", error);
      showAlert('error', "Erreur lors de la suppression des catégories");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
    setModals((prev) => ({ ...prev, multipleDelete: false }));
  };

  const handleSave = async (data: CategoryFormData) => {
    setIsLoading(true);
    setLoadingAction(selectedCategory ? "update" : "create");
    try {
      const attributs = data.attributs?.map(attr => ({
        id: attr.id_Attribut ?? '',
        nomAttribut: attr.key,
        value: attr.value,
        estObligatoire: attr.estObligatoire,
        typeAttribut: attr.typeAttribut,
        categorieId: selectedCategory?.id_Categorie || '',
      })) || [];

      const categoryData = { 
        nomCategorie: data.nomCategorie,
        isActive: data.isActive,
        typeCategory: data.typeCategory,
        attributs,
      };

      if (selectedCategory) {
        const categoryId = selectedCategory.id_Categorie;

        if (!categoryId) {
          console.error('ID de catégorie non défini dans handleSave');
          return;
        }
        await updateCategorie(categoryId, categoryData);
        await fetchCategories(); // Recharger les catégories après la mise à jour
        showAlert('success', 'Catégorie mise à jour avec succès');
      } else {
        await addCategorie({
          ...categoryData,
          createdAt: new Date().toISOString(),
          productsCount: 0,
        });
        await fetchCategories(); // Recharger les catégories après l'ajout
        showAlert('success', 'Catégorie ajoutée avec succès');
      }
      setSelectedCategory(null);
      setModals((prev) => ({ ...prev, add: false }));
      reset();
    } catch (error) {
      console.error("Error saving category:", error);
      showAlert('error', "Erreur lors de l'enregistrement de la catégorie");
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const handleAddCategory = () => {
    setIsLoading(true);
    setLoadingAction("add");
    setModals((prev) => ({ ...prev, add: true }));
    reset({
      nomCategorie: "",
      isActive: true,
      typeCategory: "",
      attributs: [],
    });
    setIsLoading(false);
    setLoadingAction(null);
  };

  const handleCheckboxChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filterAndSortCategories = useCallback((categories: Category[]) => {
    return categories
      .filter(category =>
        searchTerm === "" ||
        category.nomCategorie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.typeCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        format(parseISO(category.createdAt), "dd/MM/yyyy", { locale: fr }).includes(searchTerm)
      )
      .sort((a, b) => {
        if (filterOption === "name") {
          return sortOrder === 'asc' 
            ? a.nomCategorie?.localeCompare(b.nomCategorie || "") 
            : b.nomCategorie?.localeCompare(a.nomCategorie || "");
        } else if (filterOption === "date") {
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [searchTerm, filterOption, sortOrder]);

  useEffect(() => {
    setFilteredCategories(filterAndSortCategories(categories));
  }, [categories, searchTerm, filterOption, sortOrder, filterAndSortCategories]);

  const handleFilterChange = (value: string) => {
    setIsLoadingFilter(true);
    setFilterOption(value);
    setTimeout(() => setIsLoadingFilter(false), 300);
  };

  const toggleSortOrder = () => {
    setIsLoadingFilter(true);
    setSortOrder(prevOrder => {
      const newOrder = prevOrder === 'asc' ? 'desc' : 'asc';
      setTimeout(() => setIsLoadingFilter(false), 300);
      return newOrder;
    });
  };

  const toggleModal = (modalKey: keyof typeof modals, value: boolean) => {
    setModals((prev) => ({ ...prev, [modalKey]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 space-y-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen"
    >
      <motion.div 
        className="flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Gestion des Catégories
          </h1>
          <p className="text-gray-600 mt-2">
            Gérer et organiser les catégories de votre plateforme e-commerce
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 backdrop-filter backdrop-blur-md bg-opacity-90 ${
              alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
            style={{
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {alert.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <XCircle className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-8 md:grid-cols-7">
        <Card className="md:col-span-5 bg-white/80 backdrop-filter backdrop-blur-lg shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Liste des Catégories</CardTitle>
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
              <Select value={filterOption} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[180px] bg-white border-gray-300">
                  {isLoadingFilter ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart2 className="mr-2 h-4 w-4" />
                  )}
                  <SelectValue placeholder="Filtrer par" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="name">Nom</SelectItem>
                    <SelectItem value="date">Date de création</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="ml-2 bg-white hover:bg-gray-100 transition-colors duration-300"
                disabled={isLoadingFilter}
              >
                {isLoadingFilter ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
              {selectedCategories.length > 0 && (
                <Button
                  onClick={() => toggleModal('multipleDelete', true)}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 transition-colors duration-300"
                >
                  Supprimer la sélection ({selectedCategories.length})
                </Button>
              )}
              <Button 
                onClick={handleAddCategory}
                className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading && loadingAction === "add" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une Catégorie
                  </>
                )}
              </Button>
            </motion.div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-gray-600">Nom</TableHead>
                    <TableHead className="text-gray-600">Type</TableHead>
                    <TableHead className="text-gray-600">Date de création</TableHead>
                    <TableHead className="text-gray-600">Statut</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {isLoadingInitial ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                          <p>Chargement des catégories...</p>
                        </TableCell>
                      </TableRow>
                    ) : filteredCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Aucune catégorie trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategories
                        .slice((currentPage - 1) * categoriesPerPage, currentPage * categoriesPerPage)
                        .map((category) => (
                          <motion.tr
                            key={category.id_Categorie || Math.random()}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white hover:bg-gray-50 transition-colors duration-200"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedCategories.includes(category.id_Categorie)}
                                onCheckedChange={() => handleCheckboxChange(category.id_Categorie)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{category.nomCategorie}</TableCell>
                            <TableCell>{category.typeCategory}</TableCell>
                            <TableCell>
                              {category.createdAt ? format(parseISO(category.createdAt), "dd/MM/yyyy", { locale: fr }) : "Invalid date"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={category.isActive ? "default" : "secondary"}
                                className={category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {category.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(category)}
                                  className="text-yellow-600 hover:text-yellow-700 border-yellow-600 hover:border-yellow-700 transition-colors duration-300"
                                  disabled={isLoading}
                                >
                                  {isLoading && loadingAction === `edit-${category.id_Categorie}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Edit2 className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteConfirmation(category.id_Categorie)}
                                  className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700 transition-colors duration-300"
                                  disabled={isLoading}
                                >
                                  {isLoading && loadingAction === `delete-${category.id_Categorie}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsLoadingPage(true);
                  setCurrentPage(prev => {
                    const newPage = Math.max(prev - 1, 1);
                    setTimeout(() => setIsLoadingPage(false), 300);
                    return newPage;
                  });
                }} 
                disabled={currentPage === 1 || isLoadingPage}
                className="bg-white hover:bg-gray-100 transition-colors duration-300"
              >
                {isLoadingPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Précédent
                  </>
                )}
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {Math.ceil(filteredCategories.length / categoriesPerPage)}
              </span>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsLoadingPage(true);
                  setCurrentPage(prev => {
                    const newPage = Math.min(prev + 1, Math.ceil(filteredCategories.length / categoriesPerPage));
                    setTimeout(() => setIsLoadingPage(false), 300);
                    return newPage;
                  });
                }} 
                disabled={currentPage === Math.ceil(filteredCategories.length / categoriesPerPage) || isLoadingPage}
                className="bg-white hover:bg-gray-100 transition-colors duration-300"
              >
                {isLoadingPage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Suivant
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white/80 backdrop-filter backdrop-blur-lg shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Répartition des Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            {formattedCategoriesForChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formattedCategoriesForChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    isAnimationActive={true}
                  >
                    {formattedCategoriesForChart.map((entry: {name: string, value: number}, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(4px)",
                    }}
                  />
                  <Legend
                    layout="vertical"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">Aucune donnée disponible pour afficher le graphique.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={modals.add || !!selectedCategory} onOpenChange={(open) => {
        if (!open) {
          setModals((prev) => ({ ...prev, add: false }));
          setSelectedCategory(null);
        }
      }}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-600">
              {selectedCategory ? "Modifier la Catégorie" : "Ajouter une Nouvelle Catégorie"}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {selectedCategory 
                ? "Modifiez les informations de la catégorie pour mieux organiser vos produits." 
                : "Créez une nouvelle catégorie pour mieux structurer votre catalogue de produits."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la catégorie</Label>
              <Input id="name" {...register("nomCategorie")} placeholder="Nom de la catégorie" className="bg-white/50" />
              {errors.nomCategorie && <p className="text-sm text-red-500">{errors.nomCategorie.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeCategory">Type</Label>
              <Controller
                name="typeCategory"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-white/50">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.typeCategory && <p className="text-sm text-red-500">{errors.typeCategory.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isActive" 
                {...register("isActive")}
              />
              <Label htmlFor="isActive">Catégorie active</Label>
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Caractéristiques spécifiques</Label>
              <p className="text-sm text-gray-500 mb-2">Ajoutez des attributs uniques pour cette catégorie</p>
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Nom de l'attribut"
                      {...register(`attributs.${index}.key` as const, {
                        required: "Le nom de l'attribut est obligatoire",
                        minLength: {
                          value: 2,
                          message: "Le nom de l'attribut doit contenir au moins 2 caractères.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Le nom de l'attribut ne doit pas dépasser 50 caractères.",
                        },
                      })}
                      className="bg-white/50"
                    />
                    {errors.attributs?.[index]?.key && (
                      <p className="text-sm text-red-500">{errors.attributs[index].key?.message}</p>
                    )}
                    <Controller
                      name={`attributs.${index}.value` as const}
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full bg-white/50">
                            <SelectValue placeholder="Type de l'attribut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Texte</SelectItem>
                            <SelectItem value="number">Nombre</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Booléen</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.attributs?.[index]?.value && (
                      <p className="text-sm text-red-500">{errors.attributs[index].value?.message}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      {...register(`attributs.${index}.estObligatoire` as const)}
                      className="bg-white/50"
                    />
                    <Label htmlFor={`attributs.${index}.estObligatoire`}>Obligatoire</Label>
                    <Input
                      placeholder="Type de l'attribut"
                      {...register(`attributs.${index}.typeAttribut` as const, {
                        required: "Le type de l'attribut est obligatoire",
                        minLength: {
                          value: 2,
                          message: "Le type de l'attribut doit contenir au moins 2 caractères.",
                        },
                        maxLength: {
                          value: 50,
                          message: "Le type de l'attribut ne doit pas dépasser 50 caractères.",
                        },
                      })}
                      className="bg-white/50"
                    />
                    {errors.attributs?.[index]?.typeAttribut && (
                      <p className="text-sm text-red-500">{errors.attributs[index].typeAttribut?.message}</p>
                    )}
                    <Button type="button" variant="ghost" onClick={() => remove(index)} className="p-2">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => append({ key: "", value: "text", estObligatoire: false, typeAttribut: "" })} variant="outline" className="mt-2">
                Ajouter une caractéristique
              </Button>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                setModals((prev) => ({ ...prev, add: false }));
                setSelectedCategory(null);
              }} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isLoading}>
                {isLoading && loadingAction === (selectedCategory ? "update" : "create") ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedCategory ? "Enregistrement..." : "Création..."}
                  </>
                ) : (
                  selectedCategory ? "Enregistrer les modifications" : "Créer la catégorie"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={modals.delete} onOpenChange={(open) => setModals((prev) => ({ ...prev, delete: open }))}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Confirmer la suppression</DialogTitle>
            <DialogDescription className="text-lg">
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible et pourrait affecter les produits associés.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setModals((prev) => ({ ...prev, delete: false }))}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading && loadingAction === "delete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Confirmer la suppression"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={modals.multipleDelete} onOpenChange={(open) => setModals((prev) => ({ ...prev, multipleDelete: open }))}>
        <DialogContent className="bg-white/90 backdrop-filter backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">Confirmer la suppression multiple</DialogTitle>
            <DialogDescription className="text-lg">
              Vous êtes sur le point de supprimer {selectedCategories.length} catégories. Cette action est irréversible et pourrait affecter de nombreux produits. Êtes-vous sûr de vouloir continuer ?
              </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setModals((prev) => ({ ...prev, multipleDelete: false }))}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleMultipleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading && loadingAction === "multipleDelete" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression multiple...
                </>
              ) : (
                "Confirmer la suppression multiple"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}