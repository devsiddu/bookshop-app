import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const baseUrl = "https://bookshop-app-seven.vercel.app";

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = baseUrl;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isAuth = async () => {
    try {
      const userObj = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const user = userObj ? JSON.parse(userObj) : null;
      setToken(token);
      setUser(user);
    } catch (error) {
      console.log("auth check failed" + error.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
      router.push("(auth)");
    } catch (error) {
      console.log("Logout Failed:" + error.message);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  const value = { axios, isLoading, setIsLoading, user, token, logout, router };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
