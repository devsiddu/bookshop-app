import { createContext, useContext, useState } from "react";
import axios from "axios";
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const baseUrl = "http://192.168.10.117:3000";

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = baseUrl;
  const [isLoading, setIsLoading] = useState(false);
  const value = { axios, isLoading, setIsLoading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
