// app/dashboard/admin/components/UserStatsChart.tsx
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

// Interface pour les types de données
interface UserStatsChartProps {
  data: { name: string; total: number; actifs: number; inactifs: number }[];
}

export function UserStatsChart({ data }: UserStatsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#4B5563"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB" }}
        />
        <YAxis
          stroke="#4B5563"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB" }}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#1E40AF", fontWeight: "bold" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#4B5563" }} />
        <Bar dataKey="total" name="Total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="actifs" name="Actifs" fill="#22C55E" radius={[4, 4, 0, 0]} />
        <Bar dataKey="inactifs" name="Inactifs" fill="#F97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}