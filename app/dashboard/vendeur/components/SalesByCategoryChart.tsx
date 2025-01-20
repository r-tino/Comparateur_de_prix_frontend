// app/dashboard/vendeur/components/ChartVenteParCategory.tsx

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { categoryData, categoryColors } from '../data/chartData';

export function SalesByCategoryChart() {
  return (
    <Card className="p-6 bg-gray-900 dark:bg-gray-200 text-white dark:text-black">
      <h3 className="text-lg font-semibold text-white dark:text-black mb-4">Ventes par catégorie</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            fill="#8884d8"
            labelLine={false}
            isAnimationActive={false}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={categoryColors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}