import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  MapPin,
  Building2,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  aggregations?: any;
  type: 'employees' | 'leaves';
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange, 
  aggregations,
  type 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    department: '',
    position: '',
    status: '',
    city: '',
    salaryRange: { min: 0, max: 100000 },
    startDateRange: { from: '', to: '' },
    type: '',
    dateRange: { from: '', to: '' }
  });

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      department: '',
      position: '',
      status: '',
      city: '',
      salaryRange: { min: 0, max: 100000 },
      startDateRange: { from: '', to: '' },
      type: '',
      dateRange: { from: '', to: '' }
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.department) count++;
    if (filters.position) count++;
    if (filters.status) count++;
    if (filters.city) count++;
    if (filters.type) count++;
    if (filters.startDateRange.from || filters.startDateRange.to) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.salaryRange.min > 0 || filters.salaryRange.max < 100000) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={type === 'employees' ? "Çalışan ara (ad, soyad, email, telefon, TC, departman...)" : "İzin ara (çalışan adı, açıklama...)"}
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Filter className="h-4 w-4 mr-2" />
          Gelişmiş Filtreler
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {getActiveFilterCount()}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </button>
        
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4 mr-1" />
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          
          {/* Department Filter */}
          {(type === 'employees' || type === 'leaves') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4 inline mr-1" />
                Departman
              </label>
              <select
                value={filters.department}
                onChange={(e) => updateFilter('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Tüm Departmanlar</option>
                {aggregations?.departments && Object.entries(aggregations.departments).map(([dept, count]) => (
                  <option key={dept} value={dept}>{dept} ({count})</option>
                ))}
              </select>
            </div>
          )}

          {/* Position Filter - Only for employees */}
          {type === 'employees' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Pozisyon
              </label>
              <select
                value={filters.position}
                onChange={(e) => updateFilter('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Tüm Pozisyonlar</option>
                {aggregations?.positions && Object.entries(aggregations.positions).map(([pos, count]) => (
                  <option key={pos} value={pos}>{pos} ({count})</option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Tüm Durumlar</option>
              {aggregations?.statuses && Object.entries(aggregations.statuses).map(([status, count]) => (
                <option key={status} value={status}>
                  {type === 'employees' ? (
                    status === 'active' ? 'Aktif' : status === 'inactive' ? 'Pasif' : 'İşten Çıkış'
                  ) : (
                    status === 'pending' ? 'Beklemede' : status === 'approved' ? 'Onaylandı' : 'Reddedildi'
                  )} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type Filter - Only for leaves */}
          {type === 'leaves' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İzin Türü
              </label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Tüm İzin Türleri</option>
                {aggregations?.types && Object.entries(aggregations.types).map(([type, count]) => (
                  <option key={type} value={type}>
                    {type === 'annual' ? 'Yıllık İzin' : 
                     type === 'sick' ? 'Hastalık İzni' : 
                     type === 'maternity' ? 'Doğum İzni' : 'Kişisel İzin'} ({count})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* City Filter - Only for employees */}
          {type === 'employees' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Şehir
              </label>
              <select
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Tüm Şehirler</option>
                {aggregations?.cities && Object.entries(aggregations.cities).map(([city, count]) => (
                  <option key={city} value={city}>{city} ({count})</option>
                ))}
              </select>
            </div>
          )}

          {/* Salary Range - Only for employees */}
          {type === 'employees' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Maaş Aralığı (₺)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.salaryRange.min || ''}
                  onChange={(e) => updateFilter('salaryRange', { 
                    ...filters.salaryRange, 
                    min: parseInt(e.target.value) || 0 
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.salaryRange.max === 100000 ? '' : filters.salaryRange.max}
                  onChange={(e) => updateFilter('salaryRange', { 
                    ...filters.salaryRange, 
                    max: parseInt(e.target.value) || 100000 
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              {type === 'employees' ? 'İşe Başlama Tarihi' : 'İzin Tarihi'} Aralığı
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={type === 'employees' ? filters.startDateRange.from : filters.dateRange.from}
                onChange={(e) => {
                  if (type === 'employees') {
                    updateFilter('startDateRange', { ...filters.startDateRange, from: e.target.value });
                  } else {
                    updateFilter('dateRange', { ...filters.dateRange, from: e.target.value });
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={type === 'employees' ? filters.startDateRange.to : filters.dateRange.to}
                onChange={(e) => {
                  if (type === 'employees') {
                    updateFilter('startDateRange', { ...filters.startDateRange, to: e.target.value });
                  } else {
                    updateFilter('dateRange', { ...filters.dateRange, to: e.target.value });
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;