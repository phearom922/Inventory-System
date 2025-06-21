import React, { createContext, useContext, useEffect, useState } from 'react';

  const AuthContext = createContext();

  export function AuthProvider({ children }) {
    const [branchFilter, setBranchFilter] = useState([]);

    useEffect(() => {
      const updateBranchFilter = () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            setBranchFilter(payload.branchIds || []);
          } catch (e) {
            console.error('Error decoding token:', e);
            setBranchFilter([]);
          }
        } else {
          setBranchFilter([]);
        }
      };

      updateBranchFilter(); // เรียกครั้งแรก
      const handleStorageChange = () => updateBranchFilter(); // อัปเดตเมื่อ token เปลี่ยน
      window.addEventListener('storage', handleStorageChange);

      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
      <AuthContext.Provider value={{ branchFilter }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export const useAuth = () => useContext(AuthContext);

  export default AuthProvider;