import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DataTable } from './components/Tables/DataTable';
import { RecordForm } from './components/Forms/RecordForm';
import { AdvancedFilters } from './components/Filters/AdvancedFilters';
import { WastageReport } from './components/Reports/WastageReport';
import { StatsCards } from './components/Analytics/StatsCards';
import { SalesChart } from './components/Analytics/SalesChart';
import { useSalesData } from './hooks/useSalesData';
import { calculateAnalytics } from './utils/analytics';
import { exportToExcel } from './utils/export';
import { SectionType, SalesRecord } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('cafeteria');
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showWastageReport, setShowWastageReport] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const {
    getFilteredData,
    addRecord,
    updateRecord,
    deleteRecord,
    filters,
    setFilters,
    getAllData
  } = useSalesData();

  const currentData = getFilteredData(activeSection);
  const analytics = calculateAnalytics(currentData);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEditRecord = (record: SalesRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleSaveRecord = (recordData: Omit<SalesRecord, 'id'>) => {
    if (editingRecord) {
      updateRecord(activeSection, editingRecord.id, recordData);
    } else {
      addRecord(activeSection, recordData);
    }
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteRecord(activeSection, id);
    }
  };

  const handleExport = () => {
    const allData = getAllData();
    exportToExcel(allData, activeSection);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (!showFilters) {
      setShowAdvancedFilters(true);
    }
  };

  const hasActiveFilters = filters.dateRange || filters.searchTerm || filters.year || filters.month;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <div className="ml-64">
        <Header
          activeSection={activeSection}
          onAddRecord={handleAddRecord}
          onToggleFilters={toggleFilters}
          onExport={handleExport}
          onShowWastageReport={() => setShowWastageReport(true)}
          showFilters={showFilters}
        />
        
        <main className="pt-20 p-6">
          {showFilters && (
            <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                      {filters.dateRange && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {filters.dateRange.start} to {filters.dateRange.end}
                        </span>
                      )}
                      {filters.searchTerm && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Search: {filters.searchTerm}
                        </span>
                      )}
                      {filters.year && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          Year: {filters.year}
                        </span>
                      )}
                      {filters.month && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Month: {filters.month}
                        </span>
                      )}
                    </div>
                  )}
                  {!hasActiveFilters && (
                    <span className="text-sm text-gray-500">No filters applied</span>
                  )}
                </div>
                <button
                  onClick={() => setShowAdvancedFilters(true)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Modify Filters
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <StatsCards analytics={analytics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart data={currentData} type="line" />
              <SalesChart data={currentData} type="bar" />
            </div>
            
            <DataTable
              data={currentData}
              section={activeSection}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          </div>
        </main>
      </div>

      {showForm && (
        <RecordForm
          section={activeSection}
          record={editingRecord}
          onSave={handleSaveRecord}
          onCancel={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
        />
      )}

      {showAdvancedFilters && (
        <AdvancedFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowAdvancedFilters(false)}
          isOpen={showAdvancedFilters}
        />
      )}

      {showWastageReport && (
        <WastageReport
          data={getAllData()}
          onClose={() => setShowWastageReport(false)}
        />
      )}
    </div>
  );
}

export default App;