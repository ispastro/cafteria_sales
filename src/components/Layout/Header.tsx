import React from 'react';
import { Download, Filter, Plus, AlertTriangle } from 'lucide-react';
import { SectionType } from '../../types';

interface HeaderProps {
  activeSection: SectionType;
  onAddRecord: () => void;
  onToggleFilters: () => void;
  onExport: () => void;
  onShowWastageReport: () => void;
  showFilters: boolean;
}

const sectionTitles = {
  cafeteria: 'Cafeteria Sales',
  events: 'Events Management',
  pressbar: 'Pressbar Sales'
};

const sectionDescriptions = {
  cafeteria: 'Agreement-based sales tracking',
  events: 'Daily activities and event management',
  pressbar: 'Bar sales and inventory tracking'
};

export function Header({ 
  activeSection, 
  onAddRecord, 
  onToggleFilters, 
  onExport, 
  onShowWastageReport,
  showFilters 
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sectionTitles[activeSection]}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {sectionDescriptions[activeSection]}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleFilters}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <button
              onClick={onShowWastageReport}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Wastage Report
            </button>
            
            <button
              onClick={onExport}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={onAddRecord}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}