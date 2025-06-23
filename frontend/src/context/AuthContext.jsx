// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // ติดตั้งผ่าน npm install jwt-decode

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [branchFilter, setBranchFilter] = useState([]);

  const updateBranchFilter = () => {
    const token = localStorage.getItem('token');
    console.log('[AuthContext] Token from localStorage:', token);
    if (token) {
      try {
        const payload = jwtDecode(token); // ใช้ jwtDecode แทน
        console.log('[AuthContext] Decoded payload:', payload);
        const newBranchFilter = payload.branchIds || [];
        console.log('[AuthContext] branchFilter updated:', newBranchFilter);
        setBranchFilter(newBranchFilter);
      } catch (e) {
        console.error('[AuthContext] Error decoding token:', e);
        setBranchFilter([]);
      }
    } else {
      setBranchFilter([]);
    }
  };

  useEffect(() => {
    updateBranchFilter();
    const handleStorageChange = () => updateBranchFilter();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // อาจเพิ่ม dependency ถ้าต้องการ re-run

  return (
    <AuthContext.Provider value={{ branchFilter, refreshBranchFilter: updateBranchFilter }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;