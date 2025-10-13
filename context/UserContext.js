import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import api from "../services/api.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ambil profile user kalau ada token
  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      const res = await api.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("getProfile:", res.data, "isinya");

      // sesuaikan struktur respon API kamu
      setUser(res.data.user || res.data);
    } catch (err) {
      console.log("Error getProfile:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // login
 const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });

  // sesuaikan dengan struktur response backend
  const token = res.data.data?.token || res.data.token;
  // console.log("token:", token);
  await AsyncStorage.setItem("token", token);

  setUser(res.data.user || res.data.data?.user);
  return res.data;
};


  // register
  const register = async (email, password, displayName) => {
    const res = await api.post("/auth/register", {
      email,
      password,
      displayName,
    });

    if (!res.data.token) {
      return await login(email, password);
    }

    await AsyncStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // logout
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, login, register, logout, getProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
