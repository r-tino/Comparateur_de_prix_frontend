// app/dashboard/admin/historique-prix/pages.tsx

"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, ArrowUpIcon, ArrowDownIcon, Calendar, Coins, RefreshCw, Tag, User } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Types based on the class diagram
interface PriceHistory {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  priceType: "Produit" | "Offre";
  owner: string;
  changeDate: Date;
}

interface Product {
  id: string;
  name: string;
  initialPrice: number;
}

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "iPhone 14 Pro", initialPrice: 1299000 },
  { id: "2", name: "Samsung Galaxy S23", initialPrice: 999000 },
  { id: "3", name: "MacBook Pro M2", initialPrice: 2499000 },
  { id: "4", name: "iPad Air", initialPrice: 799000 },
  { id: "5", name: "AirPods Pro", initialPrice: 299000 },
];

const mockPriceHistory: PriceHistory[] = [
  {
    id: "1",
    productId: "1",
    productName: "iPhone 14 Pro",
    oldPrice: 1299000,
    newPrice: 1199000,
    priceType: "Produit",
    owner: "Jean Dupont",
    changeDate: new Date("2024-01-15"),
  },
  {
    id: "2",
    productId: "1",
    productName: "iPhone 14 Pro",
    oldPrice: 1199000,
    newPrice: 1099000,
    priceType: "Offre",
    owner: "Marie Martin",
    changeDate: new Date("2024-01-20"),
  },
  {
    id: "3",
    productId: "2",
    productName: "Samsung Galaxy S23",
    oldPrice: 999000,
    newPrice: 899000,
    priceType: "Produit",
    owner: "Pierre Durand",
    changeDate: new Date("2024-01-18"),
  },
  {
    id: "4",
    productId: "3",
    productName: "MacBook Pro M2",
    oldPrice: 2499000,
    newPrice: 2299000,
    priceType: "Offre",
    owner: "Sophie Bernard",
    changeDate: new Date("2024-01-22"),
  },
  {
    id: "5",
    productId: "4",
    productName: "iPad Air",
    oldPrice: 799000,
    newPrice: 749000,
    priceType: "Produit",
    owner: "Lucas Martin",
    changeDate: new Date("2024-01-25"),
  },
];

export default function PriceHistoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setAnimateChart(true);
    const timer = setTimeout(() => setAnimateChart(false), 500);
    return () => clearTimeout(timer);
  }, [selectedProduct]);

  // Filter price history based on selected product and search term
  const filteredHistory = mockPriceHistory.filter((history) => {
    const matchesProduct = selectedProduct === "all" || history.productId === selectedProduct;
    const matchesSearch = history.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProduct && matchesSearch;
  });

  // Prepare data for the chart
  const chartData = selectedProduct !== "all"
    ? mockPriceHistory
        .filter((history) => history.productId === selectedProduct)
        .map((history) => ({
          date: format(history.changeDate, "dd/MM/yyyy"),
          price: history.newPrice,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // Add initial price to chart data if a product is selected
  if (selectedProduct !== "all") {
    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (product) {
      chartData.unshift({
        date: format(new Date("2024-01-01"), "dd/MM/yyyy"),
        price: product.initialPrice,
      });
    }
  }

  const getPriceChangeColor = (oldPrice: number, newPrice: number) => {
    if (newPrice < oldPrice) return "text-green-600 font-semibold";
    if (newPrice > oldPrice) return "text-red-600 font-semibold";
    return "text-gray-700 font-semibold";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + " Ar";
  };

  const calculatePriceChange = (oldPrice: number, newPrice: number) => {
    const difference = newPrice - oldPrice;
    const percentage = (difference / oldPrice) * 100;
    const sign = difference > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Calculate statistics for the selected product
  const getProductStats = () => {
    if (!selectedProduct || selectedProduct === "all") return null;

    const productHistory = mockPriceHistory.filter(
      (history) => history.productId === selectedProduct
    );
    
    if (productHistory.length === 0) return null;

    const initialPrice = mockProducts.find(p => p.id === selectedProduct)?.initialPrice || 0;
    const currentPrice = productHistory[productHistory.length - 1].newPrice;
    const totalChange = ((currentPrice - initialPrice) / initialPrice) * 100;
    const averagePrice = productHistory.reduce((acc, curr) => acc + curr.newPrice, initialPrice) / (productHistory.length + 1);

    return {
      totalChange,
      averagePrice,
      numberOfChanges: productHistory.length,
    };
  };

  const stats = getProductStats();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Historique des prix</h1>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Consultez l&apos;historique des changements de prix de vos produits.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 text-gray-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="w-full md:w-[250px] bg-white text-gray-600 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Filtrer par produit" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-700">
            <SelectItem value="all">Tous les produits</SelectItem>
            {mockProducts.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProduct !== "all" && stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Variation totale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {stats.totalChange > 0 ? (
                  <ArrowUpIcon className="w-6 h-6 text-red-500 mr-2" />
                ) : (
                  <ArrowDownIcon className="w-6 h-6 text-green-500 mr-2" />
                )}
                <span className={`text-3xl font-bold ${stats.totalChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {stats.totalChange.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Coins className="w-4 h-4 mr-2" />
                Prix moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                {formatPrice(stats.averagePrice)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Nombre de changements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                {stats.numberOfChanges}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedProduct !== "all" && (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800 dark:text-gray-100">
              <TrendingUp className="h-5 w-5" />
              Évolution des prix
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Visualisation de l&apos;évolution des prix dans le temps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                price: {
                  label: "Prix",
                  color: "hsl(var(--primary))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    tickMargin={10}
                  />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    tickMargin={10}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    animationBegin={animateChart ? 0 : 2000}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Historique détaillé</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Liste complète des changements de prix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300"><Calendar className="w-4 h-4 inline-block mr-2" />Date</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><Tag className="w-4 h-4 inline-block mr-2" />Produit</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><Coins className="w-4 h-4 inline-block mr-2" />Ancien prix</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><Coins className="w-4 h-4 inline-block mr-2" />Nouveau prix</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><TrendingUp className="w-4 h-4 inline-block mr-2" />Variation</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><Tag className="w-4 h-4 inline-block mr-2" />Type</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300"><User className="w-4 h-4 inline-block mr-2" />Propriétaire</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow key={history.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {format(history.changeDate, "dd MMMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800 dark:text-gray-200">{history.productName}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{formatPrice(history.oldPrice)}</TableCell>
                    <TableCell className={getPriceChangeColor(history.oldPrice, history.newPrice)}>
                      {formatPrice(history.newPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${
                          history.newPrice < history.oldPrice
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {calculatePriceChange(history.oldPrice, history.newPrice)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/10 text-gray-700 dark:text-gray-300">
                        {history.priceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {history.owner}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}