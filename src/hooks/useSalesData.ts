import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { SalesRecord, SectionType, FilterOptions } from '../types';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export function useSalesData() {
  const [cafeteriaData, setCafeteriaData] = useLocalStorage<SalesRecord[]>('cafeteria-data', []);
  const [eventsData, setEventsData] = useLocalStorage<SalesRecord[]>('events-data', []);
  const [pressbarData, setPressbarData] = useLocalStorage<SalesRecord[]>('pressbar-data', []);
  
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: null,
    searchTerm: '',
    year: '',
    month: ''
  });

  const getDataBySection = (section: SectionType): SalesRecord[] => {
    switch (section) {
      case 'cafeteria': return cafeteriaData;
      case 'events': return eventsData;
      case 'pressbar': return pressbarData;
      default: return [];
    }
  };

  const setDataBySection = (section: SectionType, data: SalesRecord[]) => {
    switch (section) {
      case 'cafeteria': setCafeteriaData(data); break;
      case 'events': setEventsData(data); break;
      case 'pressbar': setPressbarData(data); break;
    }
  };

  const getFilteredData = (section: SectionType): SalesRecord[] => {
    const data = getDataBySection(section);
    
    return data.filter(record => {
      // Date range filter
      if (filters.dateRange) {
        const recordDate = parseISO(record.date);
        const start = startOfDay(parseISO(filters.dateRange.start));
        const end = endOfDay(parseISO(filters.dateRange.end));
        
        if (!isWithinInterval(recordDate, { start, end })) {
          return false;
        }
      }

      // Year filter
      if (filters.year) {
        const recordYear = new Date(record.date).getFullYear().toString();
        if (recordYear !== filters.year) {
          return false;
        }
      }

      // Month filter
      if (filters.month) {
        const recordMonth = (new Date(record.date).getMonth() + 1).toString().padStart(2, '0');
        if (recordMonth !== filters.month) {
          return false;
        }
      }

      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesDate = record.date.includes(searchLower);
        const matchesEventName = record.eventName?.toLowerCase().includes(searchLower);
        const matchesSales = record.totalSales.toString().includes(searchLower);
        const matchesPacks = record.packs.toString().includes(searchLower);
        
        if (!matchesDate && !matchesEventName && !matchesSales && !matchesPacks) {
          return false;
        }
      }

      return true;
    });
  };

  const addRecord = (section: SectionType, record: Omit<SalesRecord, 'id'>) => {
    const newRecord: SalesRecord = {
      ...record,
      id: Date.now().toString()
    };
    
    const currentData = getDataBySection(section);
    setDataBySection(section, [...currentData, newRecord]);
  };

  const updateRecord = (section: SectionType, id: string, updatedRecord: Omit<SalesRecord, 'id'>) => {
    const currentData = getDataBySection(section);
    const updated = currentData.map(record => 
      record.id === id ? { ...updatedRecord, id } : record
    );
    setDataBySection(section, updated);
  };

  const deleteRecord = (section: SectionType, id: string) => {
    const currentData = getDataBySection(section);
    const filtered = currentData.filter(record => record.id !== id);
    setDataBySection(section, filtered);
  };

  const getAllData = () => ({
    cafeteria: cafeteriaData,
    events: eventsData,
    pressbar: pressbarData
  });

  return {
    getFilteredData,
    addRecord,
    updateRecord,
    deleteRecord,
    filters,
    setFilters,
    getAllData
  };
}