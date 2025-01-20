// app/dashboard/admin/components/CategoryChart.tsx

"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Interface pour les types de données
interface CategoryChartProps {
  data: { nom_categorie: string; total: number }[];
}

const COLORS = [
  "#3B82F6", "#60A5FA", "#93C5FD", // Nuances de bleu
  "#22C55E", "#4ADE80", "#86EFAC", // Nuances de vert
  "#F97316", "#FB923C", "#FDBA74", // Nuances d'orange
];

export function CategoryChart({ data }: CategoryChartProps) {
  // Ajoutez des logs pour vérifier les données
  console.log("CategoryChart data:", data);

  const chartData = data.map((item) => ({
    name: item.nom_categorie,
    value: item.total,
  }));

  console.log("Formatted chartData:", chartData);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#1E40AF", fontWeight: "bold" }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: 12, color: "#4B5563" }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}