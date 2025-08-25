import React, { useState } from 'react';
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { LeaveRequest } from '../types';
import { elasticsearchService } from '../services/elasticsearchService';
import AdvancedFilters from './AdvancedFilters';
import DataGrid from './DataGrid';

interface LeaveManagementProps {
  leaveRequests: LeaveRequest[];
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({ leaveRequests }) => {
  const [searchResults, setSearchResults] = useState({ leaveRequests: [], total: 0, aggregations: {} });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  React.useEffect(() => {
    elasticsearchService.setLeaveRequests(leaveRequests);
    handleSearch({});
  }, [leaveRequests]);

  const handleSearch = async (filters: any) => {
    setLoading(true);
    try {
      const results = await elasticsearchService.searchLeaveRequests({
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

  const leaveTypes = {
    annual: 'Yıllık İzin',
    sick: 'Hastalık İzni',
    maternity: 'Doğum İzni',
    personal: 'Kişisel İzin'
  };

  const statusTypes = {
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'maternity': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approve leave request:', id);
  };

  const handleReject = (id: string) => {
    console.log('Reject leave request:', id);
  };

  const columns = [
    {
      key: 'employeeName',
      title: 'Çalışan',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      )
    },
    {
      key: 'type',
      title: 'İzin Türü',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(value)}`}>
          {leaveTypes[value as keyof typeof leaveTypes]}
        </span>
      )
    },
    {
      key: 'startDate',
      title: 'Başlangıç',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'endDate',
      title: 'Bitiş',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('tr-TR')
    },
    {
      key: 'days',
      title: 'Gün Sayısı',
      sortable: true,
      render: (value: number) => `${value} gün`
    },
    {
      key: 'status',
      title: 'Durum',
      sortable: true,
      render: (value: string) => (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
          {value === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
          {value === 'rejected' && <XCircle className="h-4 w-4 mr-1" />}
          {value === 'pending' && <Clock className="h-4 w-4 mr-1" />}
          <span>{statusTypes[value as keyof typeof statusTypes]}</span>
        </div>
      )
    },
    {
      key: 'reason',
      title: 'Açıklama',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    }
  ];

  const renderActions = (row: LeaveRequest) => (
    <div className="flex space-x-2">
      {row.status === 'pending' && (
        <>
          <button
            onClick={() => handleApprove(row.id)}
            className="text-green-600 hover:text-green-900 px-3 py-1 rounded bg-green-50 hover:bg-green-100 transition-colors text-sm"
          >
            Onayla
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="text-red-600 hover:text-red-900 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors text-sm"
          >
            Reddet
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İzin Yönetimi</h1>
          <p className="text-gray-600 mt-1">Çalışan izin talepleri ve onayları</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Yeni İzin Talebi
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-gray-600">Bekleyen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-gray-600">Onaylanan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.filter(r => r.status === 'rejected').length}
              </p>
              <p className="text-gray-600">Reddedilen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {leaveRequests.reduce((sum, r) => sum + r.days, 0)}
              </p>
              <p className="text-gray-600">Toplam Gün</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={handleSearch}
        aggregations={searchResults.aggregations}
        type="leaves"
      />

      {/* Data Grid */}
      <DataGrid
        columns={columns}
        data={searchResults.leaveRequests}
        total={searchResults.total}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        loading={loading}
        actions={renderActions}
      />
    </div>
  );
};

export default LeaveManagement;