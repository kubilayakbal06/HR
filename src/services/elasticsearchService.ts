import { Employee, LeaveRequest } from '../types';

// Mock Elasticsearch service for demonstration
// In production, this would connect to actual Elasticsearch cluster
class ElasticsearchService {
  private employees: Employee[] = [];
  private leaveRequests: LeaveRequest[] = [];

  constructor() {
    // Initialize with mock data
    this.initializeData();
  }

  private initializeData() {
    // This would be replaced with actual Elasticsearch initialization
    // For now, we'll use the mock data
  }

  setEmployees(employees: Employee[]) {
    this.employees = employees;
  }

  setLeaveRequests(leaveRequests: LeaveRequest[]) {
    this.leaveRequests = leaveRequests;
  }

  // Advanced employee search with Elasticsearch-like capabilities
  async searchEmployees(query: {
    searchTerm?: string;
    department?: string;
    position?: string;
    status?: string;
    salaryRange?: { min: number; max: number };
    startDateRange?: { from: string; to: string };
    city?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    size?: number;
  }): Promise<{ employees: Employee[]; total: number; aggregations: any }> {
    
    let filteredEmployees = [...this.employees];

    // Text search across multiple fields
    if (query.searchTerm) {
      const searchTerm = query.searchTerm.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.firstName.toLowerCase().includes(searchTerm) ||
        emp.lastName.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.phone.includes(searchTerm) ||
        emp.tcNo.includes(searchTerm) ||
        emp.department.toLowerCase().includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm) ||
        emp.address.toLowerCase().includes(searchTerm)
      );
    }

    // Department filter
    if (query.department) {
      filteredEmployees = filteredEmployees.filter(emp => emp.department === query.department);
    }

    // Position filter
    if (query.position) {
      filteredEmployees = filteredEmployees.filter(emp => emp.position === query.position);
    }

    // Status filter
    if (query.status) {
      filteredEmployees = filteredEmployees.filter(emp => emp.status === query.status);
    }

    // Salary range filter
    if (query.salaryRange) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.salary >= query.salaryRange!.min && emp.salary <= query.salaryRange!.max
      );
    }

    // Start date range filter
    if (query.startDateRange) {
      filteredEmployees = filteredEmployees.filter(emp => {
        const startDate = new Date(emp.startDate);
        const fromDate = new Date(query.startDateRange!.from);
        const toDate = new Date(query.startDateRange!.to);
        return startDate >= fromDate && startDate <= toDate;
      });
    }

    // City filter (extracted from address)
    if (query.city) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.address.toLowerCase().includes(query.city!.toLowerCase())
      );
    }

    // Sorting
    if (query.sortBy) {
      filteredEmployees.sort((a, b) => {
        let aValue: any = a[query.sortBy as keyof Employee];
        let bValue: any = b[query.sortBy as keyof Employee];

        if (query.sortBy === 'fullName') {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (query.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Pagination
    const page = query.page || 1;
    const size = query.size || 10;
    const startIndex = (page - 1) * size;
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + size);

    // Generate aggregations (like Elasticsearch facets)
    const aggregations = this.generateEmployeeAggregations(this.employees);

    return {
      employees: paginatedEmployees,
      total: filteredEmployees.length,
      aggregations
    };
  }

  // Advanced leave request search
  async searchLeaveRequests(query: {
    searchTerm?: string;
    type?: string;
    status?: string;
    dateRange?: { from: string; to: string };
    department?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    size?: number;
  }): Promise<{ leaveRequests: LeaveRequest[]; total: number; aggregations: any }> {
    
    let filteredRequests = [...this.leaveRequests];

    // Text search
    if (query.searchTerm) {
      const searchTerm = query.searchTerm.toLowerCase();
      filteredRequests = filteredRequests.filter(req => 
        req.employeeName.toLowerCase().includes(searchTerm) ||
        req.reason.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (query.type) {
      filteredRequests = filteredRequests.filter(req => req.type === query.type);
    }

    // Status filter
    if (query.status) {
      filteredRequests = filteredRequests.filter(req => req.status === query.status);
    }

    // Date range filter
    if (query.dateRange) {
      filteredRequests = filteredRequests.filter(req => {
        const startDate = new Date(req.startDate);
        const fromDate = new Date(query.dateRange!.from);
        const toDate = new Date(query.dateRange!.to);
        return startDate >= fromDate && startDate <= toDate;
      });
    }

    // Sorting
    if (query.sortBy) {
      filteredRequests.sort((a, b) => {
        let aValue: any = a[query.sortBy as keyof LeaveRequest];
        let bValue: any = b[query.sortBy as keyof LeaveRequest];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (query.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    // Pagination
    const page = query.page || 1;
    const size = query.size || 10;
    const startIndex = (page - 1) * size;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + size);

    // Generate aggregations
    const aggregations = this.generateLeaveAggregations(this.leaveRequests);

    return {
      leaveRequests: paginatedRequests,
      total: filteredRequests.length,
      aggregations
    };
  }

  private generateEmployeeAggregations(employees: Employee[]) {
    const departments = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const positions = employees.reduce((acc, emp) => {
      acc[emp.position] = (acc[emp.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statuses = employees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cities = employees.reduce((acc, emp) => {
      const city = emp.address.split(',').pop()?.trim() || 'Bilinmiyor';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const salaryRanges = {
      '0-15000': employees.filter(emp => emp.salary < 15000).length,
      '15000-25000': employees.filter(emp => emp.salary >= 15000 && emp.salary < 25000).length,
      '25000-35000': employees.filter(emp => emp.salary >= 25000 && emp.salary < 35000).length,
      '35000+': employees.filter(emp => emp.salary >= 35000).length,
    };

    return {
      departments,
      positions,
      statuses,
      cities,
      salaryRanges
    };
  }

  private generateLeaveAggregations(leaveRequests: LeaveRequest[]) {
    const types = leaveRequests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statuses = leaveRequests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRequests = leaveRequests.reduce((acc, req) => {
      const month = new Date(req.startDate).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      types,
      statuses,
      monthlyRequests
    };
  }
}

export const elasticsearchService = new ElasticsearchService();