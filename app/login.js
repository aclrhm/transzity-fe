import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { UserContext } from "../context/UserContext";

const { width } = Dimensions.get("window");

export default function LoginPage() {
  const router = useRouter();
  const { login, getProfile } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // 👈 state buat toggle visibility

  const handleLogin = async () => {
    try {
      await login(email, password);
      await getProfile();
      router.replace("/");
    } catch (err) {
      Alert.alert("Login gagal", "Email atau password salah!");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Peringatan", "Silakan isi email terlebih dahulu.");
      return;
    }
    try {
      const res = await api.post("/auth/forgot-password", { email });
      Alert.alert(
        "Berhasil",
        res.data.message || "Link reset password sudah dikirim ke email kamu."
      );
    } catch (err) {
      Alert.alert("Gagal", err.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.headerBg}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/onboarding")}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.card}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk ke akun anda</Text>
        </View>

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Input Password + Toggle */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Kata Sandi"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={{
              flex: 1,
              height: 45,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "#333",
            }}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Lupa Password rata kanan */}
        <View style={styles.forgotWrapper}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Lupa Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Belum memiliki akun?{" "}
          <Text style={styles.login} onPress={() => router.push("/signUp")}>
            Daftar
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#3b6ef5",
    alignItems: "center",
  },
  headerBg: {
    width: "100%",
    height: 260,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backButton: {
    marginTop: 40,
    marginLeft: 15,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 5,
  },
  card: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: width * 0.9,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  headerText: { marginBottom: 20, alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#537FE7",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: { fontSize: 14, color: "#537FE7", textAlign: "center" },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 14,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingRight: 10,
  },
  eyeButton: {
    paddingHorizontal: 6,
  },
  forgotWrapper: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: -8,
    marginBottom: 10,
  },
  forgotPassword: {
    color: "#3b6ef5",
    fontWeight: "500",
    fontSize: 13,
  },
  button: {
    width: "100%",
    backgroundColor: "#3b6ef5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: { marginTop: 20, fontSize: 14, color: "#444" },
  login: { fontWeight: "bold", color: "#000" },
});
