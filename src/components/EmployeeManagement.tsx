import React, { useState } from 'react';
import { Plus, Edit3, Eye, Mail, Phone, User } from 'lucide-react';
import { Employee } from '../types';
import { elasticsearchService } from '../services/elasticsearchService';
import AdvancedFilters from './AdvancedFilters';
import DataGrid from './DataGrid';

interface EmployeeManagementProps {
  employees: Employee[];
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees }) => {
  const [searchResults, setSearchResults] = useState({ employees: [], total: 0, aggregations: {} });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  React.useEffect(() => {
    elasticsearchService.setEmployees(employees);
    handleSearch({});
  }, [employees]);

  const handleSearch = async (filters: any) => {
    setLoading(true);
    try {
      const results = await elasticsearchService.searchEmployees({
        ...filters,
        sortBy,
        sortOrder,
        page,
        size: pageSize
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(order);
    // Trigger search with new sort parameters
    handleSearch({});
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    handleSearch({});
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    handleSearch({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'terminated': return 'İşten Çıkış';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'fullName',
      title: 'Ad Soyad',
      sortable: true,
      render: (value: any, row: Employee) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
            <div className="text-sm text-gray-500">{row.position}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      title: 'Departman',
      sortable: true
    },
    {
      key: 'email',
      title: 'E-posta',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Telefon',
      render: (value: string) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'startDate',
      title: 'İşe Başlama',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'salary',
      title: 'Maaş',
      sortable: true,
      render: (value: number) => `₺${value.toLocaleString('tr-TR')}`
    },
    {
      key: 'status',
      title: 'Durum',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    }
  ];

  const renderActions = (row: Employee) => (
    <div className="flex space-x-2">
      <button
        onClick={() => setSelectedEmployee(row)}
        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Detayları Görüntüle"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        title="Düzenle"
      >
        <Edit3 className="h-4 w-4" />
      </button>
    </div>
  );

  const calculateTenure = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} yıl ${months} ay`;
    }
    return `${months} ay`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Çalışan Yönetimi</h1>
          <p className="text-gray-600 mt-1">Çalışan bilgileri ve kayıtları</p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Yeni Çalışan
        </button>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={handleSearch}
        aggregations={searchResults.aggregations}
        type="employees"
      />

      {/* Data Grid */}
      <DataGrid
        columns={columns}
        data={searchResults.employees}
        total={searchResults.total}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
        onRowClick={setSelectedEmployee}
        actions={renderActions}
      />

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h2>
              <p className="text-gray-600">{selectedEmployee.position}</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kişisel Bilgiler</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">TC Kimlik No:</span> {selectedEmployee.tcNo}</div>
                    <div><span className="font-medium">Doğum Tarihi:</span> {selectedEmployee.birthDate}</div>
                    <div><span className="font-medium">E-posta:</span> {selectedEmployee.email}</div>
                    <div><span className="font-medium">Telefon:</span> {selectedEmployee.phone}</div>
                    <div><span className="font-medium">Adres:</span> {selectedEmployee.address}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">İş Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Departman:</span> {selectedEmployee.department}</div>
                    <div><span className="font-medium">Pozisyon:</span> {selectedEmployee.position}</div>
                    <div><span className="font-medium">İşe Başlama:</span> {selectedEmployee.startDate}</div>
                    <div><span className="font-medium">SGK No:</span> {selectedEmployee.sgkNo}</div>
                    <div><span className="font-medium">Maaş:</span> ₺{selectedEmployee.salary.toLocaleString('tr-TR')}</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acil Durum İletişim</h3>
                <div className="text-sm space-y-2">
                  <div><span className="font-medium">Ad Soyad:</span> {selectedEmployee.emergencyContact.name}</div>
                  <div><span className="font-medium">Telefon:</span> {selectedEmployee.emergencyContact.phone}</div>
                  <div><span className="font-medium">Yakınlık:</span> {selectedEmployee.emergencyContact.relation}</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;