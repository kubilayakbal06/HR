import { Employee, LeaveRequest, PayrollRecord, BiMetrics, Department } from '../types';

export const employees: Employee[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    tcNo: '12345678901',
    email: 'ahmet.yilmaz@sirket.com',
    phone: '+90 532 123 4567',
    department: 'Yazılım Geliştirme',
    position: 'Senior Developer',
    startDate: '2020-03-15',
    salary: 25000,
    status: 'active',
    sgkNo: 'SGK123456',
    birthDate: '1985-07-12',
    address: 'Kadıköy, İstanbul',
    emergencyContact: {
      name: 'Fatma Yılmaz',
      phone: '+90 532 987 6543',
      relation: 'Eş'
    }
  },
  {
    id: '2',
    firstName: 'Ayşe',
    lastName: 'Demir',
    tcNo: '23456789012',
    email: 'ayse.demir@sirket.com',
    phone: '+90 533 234 5678',
    department: 'İnsan Kaynakları',
    position: 'İK Uzmanı',
    startDate: '2019-06-01',
    salary: 18000,
    status: 'active',
    sgkNo: 'SGK234567',
    birthDate: '1988-03-22',
    address: 'Beşiktaş, İstanbul',
    emergencyContact: {
      name: 'Mehmet Demir',
      phone: '+90 533 876 5432',
      relation: 'Baba'
    }
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    tcNo: '34567890123',
    email: 'mehmet.kaya@sirket.com',
    phone: '+90 534 345 6789',
    department: 'Finans',
    position: 'Muhasebe Uzmanı',
    startDate: '2021-01-10',
    salary: 16000,
    status: 'active',
    sgkNo: 'SGK345678',
    birthDate: '1990-11-08',
    address: 'Şişli, İstanbul',
    emergencyContact: {
      name: 'Zeynep Kaya',
      phone: '+90 534 765 4321',
      relation: 'Eş'
    }
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Ahmet Yılmaz',
    type: 'annual',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 5,
    status: 'approved',
    reason: 'Yıllık izin'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Ayşe Demir',
    type: 'sick',
    startDate: '2024-02-12',
    endDate: '2024-02-14',
    days: 3,
    status: 'pending',
    reason: 'Sağlık raporu'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mehmet Kaya',
    type: 'personal',
    startDate: '2024-02-18',
    endDate: '2024-02-18',
    days: 1,
    status: 'approved',
    reason: 'Kişisel işler'
  }
];

export const payrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Ahmet Yılmaz',
    month: '2024-01',
    grossSalary: 25000,
    netSalary: 18500,
    sgkPremium: 3625,
    incomeTax: 2875,
    overtimeHours: 15,
    overtimePay: 1250
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Ayşe Demir',
    month: '2024-01',
    grossSalary: 18000,
    netSalary: 13320,
    sgkPremium: 2610,
    incomeTax: 2070,
    overtimeHours: 8,
    overtimePay: 480
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Mehmet Kaya',
    month: '2024-01',
    grossSalary: 16000,
    netSalary: 11840,
    sgkPremium: 2320,
    incomeTax: 1840,
    overtimeHours: 5,
    overtimePay: 300
  }
];

export const biMetrics: BiMetrics = {
  totalEmployees: 3,
  turnoverRate: 8.5,
  averageTenure: 2.8,
  totalPayrollCost: 59000,
  averageSalary: 19667,
  activeLeaves: 2,
  pendingLeaves: 1,
  overtimeHours: 28
};

export const departments: Department[] = [
  {
    id: '1',
    name: 'Yazılım Geliştirme',
    employeeCount: 1,
    manager: 'Ahmet Yılmaz',
    budget: 500000
  },
  {
    id: '2',
    name: 'İnsan Kaynakları',
    employeeCount: 1,
    manager: 'Ayşe Demir',
    budget: 200000
  },
  {
    id: '3',
    name: 'Finans',
    employeeCount: 1,
    manager: 'Mehmet Kaya',
    budget: 300000
  }
];