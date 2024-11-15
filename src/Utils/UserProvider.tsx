import React, { createContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface UserContextType {
  token: string | null;
  updateToken: (newToken: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${backendUrl}/profile`, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      validateToken(storedToken).then((isValid) => {
        if (isValid) {
          setToken(storedToken);
        } else {
          Cookies.remove("token");
        }
      });
    }
  }, [token]);

  const updateToken = (newToken: string) => {
    setToken(newToken);
  };

  return (
    <UserContext.Provider value={{ token, updateToken }}>
      {children}
    </UserContext.Provider>
  );
};
