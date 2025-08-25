export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  tcNo: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'terminated';
  sgkNo?: string;
  birthDate: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'maternity' | 'personal';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  grossSalary: number;
  netSalary: number;
  sgkPremium: number;
  incomeTax: number;
  overtimeHours: number;
  overtimePay: number;
}

export interface BiMetrics {
  totalEmployees: number;
  turnoverRate: number;
  averageTenure: number;
  totalPayrollCost: number;
  averageSalary: number;
  activeLeaves: number;
  pendingLeaves: number;
  overtimeHours: number;
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  manager: string;
  budget: number;
}

export type UserRole = 'hr' | 'finance' | 'manager' | 'employee' | 'isg';