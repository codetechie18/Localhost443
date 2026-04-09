import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((email, password, role) => {
    setUser({
      id: role === 'admin' ? 'admin1' : 'citizen1',
      email,
      role,
      name: role === 'admin' ? 'NMC Admin' : 'Citizen User',
    });
    return true;
  }, []);

  const signup = useCallback((name, email, password, role) => {
    setUser({
      id: role === 'admin' ? 'admin1' : 'citizen1',
      email,
      role,
      name,
    });
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
