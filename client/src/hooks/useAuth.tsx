
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useToast } from '@/hooks/use-toast';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   userType: 'donor' | 'recipient';
// }

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   // signIn: (email: string, password: string) => Promise<void>;
//   // signUp: (name: string, email: string, password: string, userType: 'donor' | 'recipient') => Promise<void>;
//   // signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Check if user is stored in localStorage
//     const storedUser = localStorage.getItem('user');

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }

//     setIsLoading(false);
//   }, []);


//   return (

//     <AuthContext.Provider value={{ user, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  userType: 'donor' | 'recipient';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUserData: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log('hereeererererer');
    }
    setIsLoading(false);
  }, []);

  const setUserData = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
