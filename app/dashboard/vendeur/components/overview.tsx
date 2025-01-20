// app/dashboard/vendeur/components/overview.tsx

"use client"

import { DollarSign, Users, ShoppingCart, RefreshCcw } from 'lucide-react'
import { CarteMetrique } from './CarteMetrique'
import { RevenueOrdersChart } from './RevenueOrdersChart'
import { SalesByCategoryChart } from './SalesByCategoryChart'
import { TopProductsTable } from './TopProductsTable'

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6">
        <CarteMetrique
          title="Ventes totales"
          value="825,491.73 Ar"
          change={{ value: "20.9%", isPositive: true }}
          additionalInfo="+18.4K cette semaine"
          icon={<DollarSign className="w-4 h-4 text-green-500" />}
          isHighlighted
        />
        <CarteMetrique
          title="Visiteurs"
          value="780,192"
          change={{ value: "13%", isPositive: true }}
          additionalInfo="+3,5K cette semaine"
          icon={<Users className="w-4 h-4" />}
        />
        <CarteMetrique
          title="Commandes totales"
          value="2,625,991"
          change={{ value: "4.2%", isPositive: true }}
          additionalInfo="+5K cette semaine"
          icon={<ShoppingCart className="w-4 h-4" />}
        />
        <CarteMetrique
          title="Remboursé"
          value="780,192"
          change={{ value: "8.1%", isPositive: false }}
          additionalInfo="+66 cette semaine"
          icon={<RefreshCcw className="w-4 h-4" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-[2fr,1fr] gap-6">
        <RevenueOrdersChart />
        <SalesByCategoryChart />
      </div>

      {/* Top Products Table */}
      <TopProductsTable />
    </div>
  );
}