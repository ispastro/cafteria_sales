import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { SalesRecord, SectionType } from '../../types';
import { format } from 'date-fns';

interface RecordFormProps {
  section: SectionType;
  record?: SalesRecord;
  onSave: (record: Omit<SalesRecord, 'id'>) => void;
  onCancel: () => void;
}

const sectionConfigs = {
  cafeteria: {
    name: 'Cafeteria',
    note: 'This data is based on agreements, not daily like Events.',
    hasEventName: false
  },
  events: {
    name: 'Events',
    note: 'These are daily activities.',
    hasEventName: true
  },
  pressbar: {
    name: 'Pressbar',
    note: 'Bar sales tracking data.',
    hasEventName: false
  }
};

export function RecordForm({ section, record, onSave, onCancel }: RecordFormProps) {
  const [formData, setFormData] = useState({
    date: record?.date || format(new Date(), 'yyyy-MM-dd'),
    packs: record?.packs || 0,
    totalSales: record?.totalSales || 0,
    eventName: record?.eventName || '',
    wastage: record?.wastage || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const config = sectionConfigs[section];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.packs <= 0) {
      newErrors.packs = 'Number of packs must be greater than 0';
    }

    if (formData.totalSales <= 0) {
      newErrors.totalSales = 'Total sales must be greater than 0';
    }

    if (formData.wastage < 0) {
      newErrors.wastage = 'Wastage cannot be negative';
    }

    if (formData.wastage > formData.packs) {
      newErrors.wastage = 'Wastage cannot exceed total packs';
    }

    if (config.hasEventName && !formData.eventName.trim()) {
      newErrors.eventName = 'Event name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        date: formData.date,
        packs: formData.packs,
        totalSales: formData.totalSales,
        wastage: formData.wastage,
        ...(config.hasEventName && { eventName: formData.eventName })
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {record ? 'Edit Record' : 'Add New Record'} - {config.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{config.note}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {config.hasEventName && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
                placeholder="Enter event name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.eventName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventName && <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Packs *
            </label>
            <input
              type="number"
              value={formData.packs}
              onChange={(e) => handleChange('packs', parseInt(e.target.value) || 0)}
              min="1"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.packs ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.packs && <p className="text-red-500 text-xs mt-1">{errors.packs}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Sales ($) *
            </label>
            <input
              type="number"
              value={formData.totalSales}
              onChange={(e) => handleChange('totalSales', parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.totalSales ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.totalSales && <p className="text-red-500 text-xs mt-1">{errors.totalSales}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wastage (Packs)
            </label>
            <input
              type="number"
              value={formData.wastage}
              onChange={(e) => handleChange('wastage', parseInt(e.target.value) || 0)}
              min="0"
              max={formData.packs}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.wastage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.wastage && <p className="text-red-500 text-xs mt-1">{errors.wastage}</p>}
            <p className="text-xs text-gray-500 mt-1">Optional: Number of packs wasted</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}