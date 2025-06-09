import * as XLSX from 'xlsx';
import { SalesRecord, SectionType } from '../types';

export function exportToExcel(data: Record<SectionType, SalesRecord[]>, activeSection: SectionType) {
  const workbook = XLSX.utils.book_new();
  
  // Export data for the active section
  const sectionData = data[activeSection];
  
  if (sectionData.length === 0) {
    alert('No data to export for this section');
    return;
  }

  // Prepare data for export
  const exportData = sectionData.map(record => ({
    Date: record.date,
    ...(record.eventName && { 'Event Name': record.eventName }),
    'Number of Packs': record.packs,
    'Total Sales': record.totalSales
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Add worksheet to workbook
  const sheetName = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate filename with current date
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `${sheetName}_Sales_${currentDate}.xlsx`;
  
  // Save the file
  XLSX.writeFile(workbook, filename);
}

export function exportAllSections(data: Record<SectionType, SalesRecord[]>) {
  const workbook = XLSX.utils.book_new();
  
  // Export data for all sections
  Object.entries(data).forEach(([section, records]) => {
    if (records.length > 0) {
      const exportData = records.map(record => ({
        Date: record.date,
        ...(record.eventName && { 'Event Name': record.eventName }),
        'Number of Packs': record.packs,
        'Total Sales': record.totalSales
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const sheetName = section.charAt(0).toUpperCase() + section.slice(1);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
  });
  
  if (workbook.SheetNames.length === 0) {
    alert('No data to export');
    return;
  }
  
  // Generate filename with current date
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `Sales_Dashboard_Complete_${currentDate}.xlsx`;
  
  // Save the file
  XLSX.writeFile(workbook, filename);
}