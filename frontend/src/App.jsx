import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ReceiveStock from './pages/ReceiveStock';
import IssueStock from './pages/IssueStock';
import WasteRecord from './pages/WasteRecord';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import TransferStock from './pages/TransferStock';
import TransferReport from './pages/TransferReport';
import Sidebar from './components/Sidebar';
import './index.css';

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
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;