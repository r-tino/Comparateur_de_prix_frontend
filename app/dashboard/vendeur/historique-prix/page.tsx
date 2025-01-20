// app/dashboard/vendeur/historique-prix/page.tsx

"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from 'lucide-react';

interface PriceHistory {
  id: string;
  produit_nom: string;
  ancienPrix: number;
  prixModif: number;
  typePrix: "Produit" | "Offre" | "Promotion";
  sourceId: string;
  date_changement: string; // Changed to string for easier parsing
}

const mockPriceHistory: PriceHistory[] = [
  { id: "1", produit_nom: "Produit A", ancienPrix: 10000, prixModif: 8000, typePrix: "Promotion", sourceId: "PROMO_001", date_changement: "2024-01-01" },
  { id: "2", produit_nom: "Produit A", ancienPrix: 8000, prixModif: 12000, typePrix: "Produit", sourceId: "PROD_001", date_changement: "2024-01-15" },
  { id: "3", produit_nom: "Produit A", ancienPrix: 12000, prixModif: 9000, typePrix: "Offre", sourceId: "OFFRE_001", date_changement: "2024-02-01" },
  { id: "4", produit_nom: "Produit A", ancienPrix: 9000, prixModif: 11000, typePrix: "Produit", sourceId: "PROD_002", date_changement: "2024-02-15" },
  { id: "5", produit_nom: "Produit A", ancienPrix: 11000, prixModif: 10000, typePrix: "Promotion", sourceId: "PROMO_002", date_changement: "2024-03-01" },
  { id: "6", produit_nom: "Produit B", ancienPrix: 15000, prixModif: 12000, typePrix: "Promotion", sourceId: "PROMO_003", date_changement: "2024-01-10" },
  { id: "7", produit_nom: "Produit B", ancienPrix: 12000, prixModif: 13500, typePrix: "Produit", sourceId: "PROD_003", date_changement: "2024-02-05" },
  { id: "8", produit_nom: "Produit B", ancienPrix: 13500, prixModif: 14000, typePrix: "Offre", sourceId: "OFFRE_002", date_changement: "2024-02-20" },
  { id: "9", produit_nom: "Produit B", ancienPrix: 14000, prixModif: 13000, typePrix: "Promotion", sourceId: "PROMO_004", date_changement: "2024-03-10" },
];

const prepareChartData = (history: PriceHistory[], productName: string) => {
  return history
    .filter(h => h.produit_nom === productName)
    .map(h => ({
      date: h.date_changement,
      prix: h.prixModif,
      type: h.typePrix,
      ancienPrix: h.ancienPrix
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-night-blue p-4 rounded shadow-lg border border-gray-700">
        <p className="text-light-blue font-semibold">{format(parseISO(label), "dd MMM yyyy", { locale: fr })}</p>
        <p className="text-text-primary">Prix: {data.prix.toLocaleString()} Ar</p>
        <p className="text-text-secondary">Ancien prix: {data.ancienPrix.toLocaleString()} Ar</p>
        <p className="text-text-secondary">Type: {data.type}</p>
      </div>
    );
  }
  return null;
};

export default function HistoriquePrixPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<string>("date");
  const [selectedProduct, setSelectedProduct] = useState("Produit A");
  const [currentPage, setCurrentPage] = useState(1);
  const historyPerPage = 5;

  const filteredHistory = useMemo(() => {
    return mockPriceHistory.filter(history =>
      history.produit_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.sourceId.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
      if (filterOption === "date") {
        return new Date(b.date_changement).getTime() - new Date(a.date_changement).getTime();
      } else if (filterOption === "price") {
        return b.prixModif - a.prixModif;
      }
      return 0;
    });
  }, [searchTerm, filterOption]);

  const chartData = useMemo(() => prepareChartData(mockPriceHistory, selectedProduct), [selectedProduct]);

  const getVariationPercentage = (ancien: number, nouveau: number) => {
    const variation = ((nouveau - ancien) / ancien) * 100;
    return variation.toFixed(1);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Promotion":
        return "bg-purple-500";
      case "Offre":
        return "bg-blue-500";
      case "Produit":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-night-blue text-text-primary">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Historique des Prix</h1>
          <p className="text-text-secondary mt-2">
            Suivez l&apos;évolution des prix de vos produits
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <Input 
            placeholder="Rechercher par produit ou référence..." 
            className="pl-10 bg-dark-blue text-text-primary border-dark-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterOption} onValueChange={setFilterOption}>
          <SelectTrigger className="bg-dark-blue text-text-primary border-dark-blue w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent className="bg-night-blue text-text-primary">
            <SelectItem value="date">Date de modification</SelectItem>
            <SelectItem value="price">Prix</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger className="bg-dark-blue text-text-primary border-dark-blue w-[180px]">
            <SelectValue placeholder="Sélectionner un produit" />
          </SelectTrigger>
          <SelectContent className="bg-night-blue text-text-primary">
            <SelectItem value="Produit A">Produit A</SelectItem>
            <SelectItem value="Produit B">Produit B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-dark-blue border-dark-blue">
        <CardHeader>
          <CardTitle className="text-text-primary">Évolution des prix - {selectedProduct}</CardTitle>
          <CardDescription className="text-text-secondary">
            Visualisation de l&apos;historique des prix dans le temps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full max-w-3xl mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(date) => format(parseISO(date), "dd MMM", { locale: fr })}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#E5E7EB' }}
                  formatter={(value) => <span style={{ color: '#E5E7EB' }}>{value}</span>}
                />
                <ReferenceLine y={chartData[0]?.prix} stroke="#FCD34D" strokeDasharray="3 3" label={{ value: 'Prix initial', fill: '#FCD34D', position: 'insideTopLeft' }} />
                <Line 
                  type="monotone" 
                  dataKey="prix" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="ancienPrix" 
                  stroke="#9CA3AF" 
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-text-secondary">Produit</TableHead>
            <TableHead className="text-text-secondary">Ancien Prix</TableHead>
            <TableHead className="text-text-secondary">Nouveau Prix</TableHead>
            <TableHead className="text-text-secondary">Variation</TableHead>
            <TableHead className="text-text-secondary">Type</TableHead>
            <TableHead className="text-text-secondary">Référence</TableHead>
            <TableHead className="text-text-secondary">Date de modification</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHistory
            .slice((currentPage - 1) * historyPerPage, currentPage * historyPerPage)
            .map((history) => (
            <TableRow key={history.id}>
              <TableCell className="font-medium">{history.produit_nom}</TableCell>
              <TableCell>{history.ancienPrix.toLocaleString()} Ar</TableCell>
              <TableCell>{history.prixModif.toLocaleString()} Ar</TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={history.prixModif > history.ancienPrix ? "bg-green-500" : "bg-red-500"}
                >
                  {getVariationPercentage(history.ancienPrix, history.prixModif)}%
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getTypeColor(history.typePrix)}>
                  {history.typePrix}
                </Badge>
              </TableCell>
              <TableCell>{history.sourceId}</TableCell>
              <TableCell>
                {format(parseISO(history.date_changement), "dd/MM/yyyy", { locale: fr })}
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
          Page {currentPage} de {Math.ceil(filteredHistory.length / historyPerPage)}
        </span>
        <Button 
          className="bg-dark-blue text-text-primary hover:bg-dark-blue/90" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredHistory.length / historyPerPage)))} 
          disabled={currentPage === Math.ceil(filteredHistory.length / historyPerPage)}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

