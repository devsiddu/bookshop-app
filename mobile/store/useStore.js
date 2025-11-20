import { router } from "expo-router";
import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

axios.defaults.baseURL = "https://bookshop-app-seven.vercel.app";
axios.defaults.withCredentials = true;
export const useStore = create((set) => ({
  router: router,
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);
        set({ user: data.user, token: data.token, isLoading: false });
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      set({ isLoading: false });
      console.log("Register Server Error: " + error.message);
      return { success: false, message: "Server Error" + error.message };
    }
  },

  isAuth: async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const user = userJson ? JSON.parse(userJson) : null;
      set({ user, token });
    } catch (error) {
      console.log("Auth Error: " + error.message);
    }
  },
  logout: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null });
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });
      if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);
        set({ user: data.user, token: data.token, isLoading: false });
        return { success: true };
      } else {
        set({ isLoading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.message };
    }
  },
}));
