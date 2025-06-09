import React from 'react';
import { AlertTriangle, TrendingDown, Package, DollarSign } from 'lucide-react';
import { SalesRecord, SectionType } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface WastageReportProps {
  data: Record<SectionType, SalesRecord[]>;
  onClose: () => void;
}

export function WastageReport({ data, onClose }: WastageReportProps) {
  const calculateWastageStats = () => {
    const stats = Object.entries(data).map(([section, records]) => {
      const totalPacks = records.reduce((sum, record) => sum + record.packs, 0);
      const totalWastage = records.reduce((sum, record) => sum + (record.wastage || 0), 0);
      const wastePercentage = totalPacks > 0 ? (totalWastage / totalPacks) * 100 : 0;
      
      return {
        section: section.charAt(0).toUpperCase() + section.slice(1),
        totalPacks,
        totalWastage,
        wastePercentage: Math.round(wastePercentage * 100) / 100,
        records: records.length
      };
    });
    
    return stats;
  };

  const wastageStats = calculateWastageStats();
  const totalWastage = wastageStats.reduce((sum, stat) => sum + stat.totalWastage, 0);
  const totalPacks = wastageStats.reduce((sum, stat) => sum + stat.totalPacks, 0);
  const overallWastePercentage = totalPacks > 0 ? (totalWastage / totalPacks) * 100 : 0;

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B'];

  const pieData = wastageStats.map((stat, index) => ({
    name: stat.section,
    value: stat.totalWastage,
    color: pieColors[index]
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <AlertTriangle size={24} className="text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Wastage Report</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Total Wastage</p>
                  <p className="text-2xl font-bold text-red-900">{totalWastage}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Packs</p>
                  <p className="text-2xl font-bold text-blue-900">{totalPacks}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Waste %</p>
                  <p className="text-2xl font-bold text-orange-900">{overallWastePercentage.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Efficiency</p>
                  <p className="text-2xl font-bold text-green-900">{(100 - overallWastePercentage).toFixed(1)}%</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Wastage Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Waste Percentage by Section</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wastageStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="section" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Waste Percentage']} />
                    <Bar dataKey="wastePercentage" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Detailed Wastage Analysis</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Packs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Wastage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waste %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wastageStats.map((stat) => (
                    <tr key={stat.section} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.totalPacks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.totalWastage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.wastePercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {stat.records}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          stat.wastePercentage <= 5 
                            ? 'bg-green-100 text-green-800'
                            : stat.wastePercentage <= 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {stat.wastePercentage <= 5 ? 'Excellent' : stat.wastePercentage <= 10 ? 'Good' : 'Needs Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}