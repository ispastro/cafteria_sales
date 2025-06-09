import React from 'react';
import { Coffee, Calendar, Wine, TrendingUp } from 'lucide-react';
import { SectionType } from '../../types';

interface SidebarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const sections = [
  { id: 'cafeteria' as SectionType, name: 'Cafeteria', icon: Coffee, description: 'Agreement-based sales' },
  { id: 'events' as SectionType, name: 'Events', icon: Calendar, description: 'Daily activities' },
  { id: 'pressbar' as SectionType, name: 'Pressbar', icon: Wine, description: 'Bar sales tracking' }
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="bg-white shadow-lg h-full w-64 fixed left-0 top-16 z-30 border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Sales Hub</span>
        </div>
        
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div>
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs text-gray-500">{section.description}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}