// app/dashboard/admin/components/TrafficChart.tsx

"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Direct", value: 30.5 },
  { name: "Referral", value: 50.5 },
  { name: "Organic", value: 19 },
]

const COLORS = ["#3B82F6", "#22C55E", "#F97316"]

export function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          labelStyle={{ color: "#1E40AF", fontWeight: "bold" }}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          iconType="circle"
          iconSize={8}
          formatter={(value, entry, index) => (
            <span style={{ color: COLORS[index % COLORS.length], fontWeight: 'bold' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}