import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { BiMetrics, Department } from '../types';

interface DashboardProps {
  metrics: BiMetrics;
  departments: Department[];
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, departments }) => {
  const kpiCards = [
    {
      title: 'Toplam Çalışan',
      value: metrics.totalEmployees,
      icon: Users,
      color: 'blue',
      change: '+5.2%',
      changeType: 'increase' as const
    },
    {
      title: 'Devir Oranı',
      value: `${metrics.turnoverRate}%`,
      icon: TrendingDown,
      color: 'green',
      change: '-2.1%',
      changeType: 'decrease' as const
    },
    {
      title: 'Ortalama Kıdem',
      value: `${metrics.averageTenure} yıl`,
      icon: Clock,
      color: 'purple',
      change: '+0.3 yıl',
      changeType: 'increase' as const
    },
    {
      title: 'Toplam Bordro Maliyeti',
      value: `₺${metrics.totalPayrollCost.toLocaleString('tr-TR')}`,
      icon: DollarSign,
      color: 'orange',
      change: '+8.5%',
      changeType: 'increase' as const
    },
    {
      title: 'Ortalama Maaş',
      value: `₺${metrics.averageSalary.toLocaleString('tr-TR')}`,
      icon: DollarSign,
      color: 'indigo',
      change: '+3.2%',
      changeType: 'increase' as const
    },
    {
      title: 'Aktif İzinler',
      value: metrics.activeLeaves,
      icon: Calendar,
      color: 'yellow',
      change: '-1',
      changeType: 'decrease' as const
    },
    {
      title: 'Bekleyen İzinler',
      value: metrics.pendingLeaves,
      icon: AlertTriangle,
      color: 'red',
      change: '+2',
      changeType: 'increase' as const
    },
    {
      title: 'Fazla Mesai (Saat)',
      value: metrics.overtimeHours,
      icon: Clock,
      color: 'gray',
      change: '+12h',
      changeType: 'increase' as const
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; icon: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
      red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-900', icon: 'text-gray-600' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">İK Dashboard</h1>
          <p className="text-gray-600 mt-1">İnsan kaynakları performans göstergeleri ve analitik</p>
        </div>
        <div className="text-sm text-gray-500">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const colors = getColorClasses(card.color);
          
          return (
            <div key={index} className={`${colors.bg} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${colors.text} opacity-70`}>{card.title}</p>
                  <p className={`text-2xl font-bold ${colors.text} mt-2`}>{card.value}</p>
                </div>
                <div className={`${colors.icon} opacity-80`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {card.changeType === 'increase' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ml-2 font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                <span className="text-gray-500 text-sm ml-1">geçen aya göre</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Departments Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Departman Özeti</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">{dept.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Çalışan Sayısı:</span>
                  <span className="font-medium">{dept.employeeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Departman Müdürü:</span>
                  <span className="font-medium">{dept.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bütçe:</span>
                  <span className="font-medium">₺{dept.budget.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Compliance Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Mevzuat Uyum Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">KVKK Uyumu</p>
              <p className="text-sm text-green-700">Tüm prosedürler aktif</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">İş Kanunu</p>
              <p className="text-sm text-green-700">Tüm kayıtlar güncel</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-green-900">SGK Bildirimleri</p>
              <p className="text-sm text-green-700">Otomatik güncellemeler aktif</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;