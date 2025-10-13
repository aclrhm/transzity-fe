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

export default function SignupPage() {
  const router = useRouter();
  const { register } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      Alert.alert("Data Belum Lengkap", "Semua kolom harus diisi!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Format Email Salah", "Masukkan alamat email yang valid!");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Kata Sandi Terlalu Pendek",
        "Kata sandi harus memiliki minimal 6 karakter!"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Kata Sandi Tidak Cocok",
        "Konfirmasi kata sandi harus sama dengan kata sandi!"
      );
      return;
    }

    try {
      await register(email, password, name);
      Alert.alert("Registrasi Berhasil", "Silakan login dengan akun Anda!");
      router.replace("/login");
    } catch (err) {
      console.error("Register gagal:", err.response?.data || err.message);
      Alert.alert("Registrasi Gagal", "Coba lagi, pastikan datanya benar!");
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
          <Text style={styles.title}>Selamat Datang di Transzity!</Text>
          <Text style={styles.subtitle}>Silahkan daftarkan akun anda</Text>
        </View>

        {/* Input Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Input Nama */}
        <TextInput
          placeholder="Nama Pengguna"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        {/* Input Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Kata Sandi"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
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

        {/* Input Konfirmasi Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Konfirmasi Kata Sandi"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={() =>
              setConfirmPasswordVisible(!confirmPasswordVisible)
            }
            style={styles.eyeButton}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Tombol Daftar */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Sudah memiliki akun?{" "}
          <Text style={styles.login} onPress={() => router.push("/login")}>
            Masuk
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
  headerText: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#537FE7",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#537FE7",
    textAlign: "center",
  },
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
  button: {
    width: "100%",
    backgroundColor: "#3b6ef5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#444",
  },
  login: {
    fontWeight: "bold",
    color: "#000",
  },
});
