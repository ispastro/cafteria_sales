import { SalesRecord, Analytics } from '../types';

export function calculateAnalytics(data: SalesRecord[]): Analytics {
  if (data.length === 0) {
    return {
      totalPacks: 0,
      totalSales: 0,
      averageSales: 0,
      recordCount: 0,
      totalWastage: 0,
      wastePercentage: 0
    };
  }

  const totalPacks = data.reduce((sum, record) => sum + record.packs, 0);
  const totalSales = data.reduce((sum, record) => sum + record.totalSales, 0);
  const totalWastage = data.reduce((sum, record) => sum + (record.wastage || 0), 0);
  const averageSales = totalSales / data.length;
  const wastePercentage = totalPacks > 0 ? (totalWastage / totalPacks) * 100 : 0;

  return {
    totalPacks,
    totalSales,
    averageSales,
    recordCount: data.length,
    totalWastage,
    wastePercentage: Math.round(wastePercentage * 100) / 100
  };
}