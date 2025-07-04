import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ตรวจสอบ path
import Home from './pages/Home';
import Login from './pages/Login';
import ReceiveStock from './pages/ReceiveStock';
import IssueStock from './pages/IssueStock';
import WasteRecord from './pages/WasteRecord';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import TransferStock from './pages/TransferStock';
import TransferReport from './pages/TransferReport';
import ProductManagement from './pages/ProductManagement';
import WarehouseManagement from './pages/WarehouseManagement';
import Sidebar from './components/Sidebar';
import './index.css';
import BranchManagement from './components/BranchManagement';


function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-blue-50">
      {!hideSidebar && <Sidebar />}
      <div className={`${hideSidebar ? '' : 'ml-16 md:ml-64'} p-4`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/receive" element={<ReceiveStock />} />
          <Route path="/issue" element={<IssueStock />} />
          <Route path="/waste" element={<WasteRecord />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/transfer" element={<TransferStock />} />
          <Route path="/transfer-report" element={<TransferReport />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/warehouse-management" element={<WarehouseManagement />} />
          <Route path="/branch-management" element={<BranchManagement />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;