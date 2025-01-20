// app/dashboard/vendeur/components/RevenueOrdersChart.tsx

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueOrdersData } from '../data/chartData';

export function RevenueOrdersChart() {
  return (
    <Card className="p-6 bg-gray-900 dark:bg-gray-200 text-white dark:text-black">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-black">Revenus vs Commandes</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-400 dark:text-gray-600">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400 dark:text-gray-600">Commandes</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueOrdersData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#ffffff'
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="orders" stroke="#22C55E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
