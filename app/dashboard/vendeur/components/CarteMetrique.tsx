// app/dashboard/vendeur/components/CarteMetrique.tsx

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    isPositive: boolean;
  };
  additionalInfo: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
}

export function CarteMetrique({
  title,
  value,
  change,
  additionalInfo,
  icon,
  isHighlighted = false,
}: MetricCardProps) {
  return (
    <Card
      className={`p-6 rounded-lg shadow-md ${
        isHighlighted
          ? "bg-highlight text-text-primary dark:bg-primary dark:text-primary-foreground"
          : "bg-background text-foreground dark:bg-card dark:text-card-foreground"
      }`}
    >
      <div className="flex flex-col">
        {/* Title and Icon */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <div className="text-xl">{icon}</div>
        </div>

        {/* Metric Value */}
        <span className="text-2xl font-bold mt-2">{value}</span>

        {/* Change and Additional Info */}
        <div className="flex items-center gap-1 mt-2">
          {change.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 text-success" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-danger" />
          )}
          <span className={`text-sm font-medium ${change.isPositive ? "text-success" : "text-danger"}`}>
            {change.value}
          </span>
          <span className="text-sm text-muted-foreground">{additionalInfo}</span>
        </div>
      </div>
    </Card>
  );
}
