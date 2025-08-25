import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import { 
  employees, 
  leaveRequests, 
  biMetrics, 
  departments 
} from './data/mockData';
import { UserRole } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole] = useState<UserRole>('hr'); // In real app, this would come from authentication

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard metrics={biMetrics} departments={departments} />;
      case 'employees':
        return <EmployeeManagement employees={employees} />;
      case 'leaves':
        return <LeaveManagement leaveRequests={leaveRequests} />;
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Raporlar</h2>
            <p className="text-gray-600">Gelişmiş raporlama modülü yakında...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">KVKK Uyum Ayarları</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-green-900">Aydınlatma Metni</h3>
                    <p className="text-sm text-green-700">Güncel ve aktif</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Aktif</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-green-900">Veri Saklama Politikası</h3>
                    <p className="text-sm text-green-700">İş Kanunu'na uygun</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Aktif</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-blue-900">Erişim Logları</h3>
                    <p className="text-sm text-blue-700">Tüm işlemler kayıt altında</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Aktif</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard metrics={biMetrics} departments={departments} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView}
      userRole={userRole}
    >
      {renderCurrentView()}
    </Layout>
  );
}

export default App;