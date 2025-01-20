// app/dashboard/vendeur/components/TopProductsTable.tsx

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from 'react'
import { topProducts } from '../data/chartData';

export function TopProductsTable() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <Card className="bg-gray-900 dark:bg-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white dark:text-black">Produits vedettes</h4>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 dark:text-gray-600">
              <th className="pb-4">Nom du produit</th>
              <th className="pb-4">Numéro de commande</th>
              <th className="pb-4">Prix</th>
              <th className="pb-4">Vendu</th>
              <th className="pb-4 text-right">Ventes</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product) => (
              <tr key={product.orderId} className="text-sm text-white dark:text-black">
                <td className="py-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-800 dark:bg-gray-300 rounded" />
                  {product.name}
                  <span className="text-gray-400 dark:text-gray-600">{product.id}</span>
                </td>
                <td className="py-2">{product.orderId}</td>
                <td className="py-2">{product.price}</td>
                <td className="py-2">{product.sold}</td>
                <td className="py-2 text-right">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}