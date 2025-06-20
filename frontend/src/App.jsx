import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ReceiveStock from './pages/ReceiveStock';
import IssueStock from './pages/IssueStock';
import WasteRecord from './pages/WasteRecord';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <Sidebar />
        <div className="ml-16 md:ml-64 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/receive" element={<ReceiveStock />} />
            <Route path="/issue" element={<IssueStock />} />
            <Route path="/waste" element={<WasteRecord />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin" element={<div>User Management (Coming Soon)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;