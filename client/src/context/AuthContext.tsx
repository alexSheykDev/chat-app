import { createContext, useCallback, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState(null);

  const logoutUser = useCallback(() => {
    localStorage.clear('User');
    setUser(null)
  }, [])

  useEffect(() => {
    const user = localStorage.getItem("User")
    if(user) setUser(JSON.parse(user))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>{children}</AuthContext.Provider>
  );
};
