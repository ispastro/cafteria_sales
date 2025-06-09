import React from 'react';
import { DollarSign, Package, TrendingUp, FileText, AlertTriangle, Target } from 'lucide-react';
import { Analytics } from '../../types';

interface StatsCardsProps {
  analytics: Analytics;
}

export function StatsCards({ analytics }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Sales',
      value: formatCurrency(analytics.totalSales),
      icon: DollarSign,
      bg: 'bg-green-50',
      color: 'text-green-600'
    },
    {
      label: 'Total Packs',
      value: analytics.totalPacks.toLocaleString(),
      icon: Package,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    {
      label: 'Average Sales',
      value: formatCurrency(analytics.averageSales),
      icon: TrendingUp,
      bg: 'bg-purple-50',
      color: 'text-purple-600'
    },
    {
      label: 'Total Records',
      value: analytics.recordCount.toString(),
      icon: FileText,
      bg: 'bg-orange-50',
      color: 'text-orange-600'
    },
    {
      label: 'Total Wastage',
      value: analytics.totalWastage.toString(),
      icon: AlertTriangle,
      bg: 'bg-red-50',
      color: 'text-red-600'
    },
    {
      label: 'Efficiency',
      value: `${(100 - analytics.wastePercentage).toFixed(1)}%`,
      icon: Target,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, bg, color }) => (
        <div key={label} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`${bg} ${color} p-3 rounded-lg`}>
              <Icon size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}