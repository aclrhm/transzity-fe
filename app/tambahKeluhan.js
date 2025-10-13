import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

export default function TambahKeluhan() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [keluhan, setKeluhan] = useState("");
  const [nomorBus, setNomorBus] = useState("");
  const [rute, setRute] = useState("");

  const handleSubmit = async () => {
    try {
      const id_user = user.data.user.uid;
      if (!id_user) {
        Alert.alert("Error", "User tidak ditemukan, silakan login ulang.");
        return;
      }

      const formData = new FormData();
      formData.append("id_user", id_user);
      formData.append("keluhan_text", keluhan);
      formData.append("nomor_bus", nomorBus);
      formData.append("rute", rute);

      await api.post("/report/uploadReport", formData);

      Alert.alert("Sukses", "Keluhan berhasil ditambahkan!");
      router.replace("/keluhanPage");
    } catch (err) {
      console.error("Gagal submit:", err.message);
      Alert.alert("Error", "Gagal menambahkan keluhan.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Laporan</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.label}>Nomor Bus</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nomor bus"
        value={nomorBus}
        onChangeText={setNomorBus}
      />

      <Text style={styles.label}>Rute</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan rute atau halte"
        value={rute}
        onChangeText={setRute}
      />

      <View style={{ marginTop: 10 }}>
        <Text style={styles.label}>Keluhan</Text>

        {/* Tombol tagline */}
        <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5 }}>
          <TouchableOpacity
            style={styles.tagButton}
            onPress={() => setKeluhan("#JagaJakarta")}
          >
            <Text style={styles.tagButtonText}>#JagaJakarta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagButton}
            onPress={() => setKeluhan("Kekerasan Seksual")}
          >
            <Text style={styles.tagButtonText}>Kekerasan Seksual</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 5, marginTop: 5 }}>
          <TouchableOpacity
            style={styles.tagButton}
            onPress={() => setKeluhan("Transaksi")}
          >
            <Text style={styles.tagButtonText}>Transaksi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tagButton}
            onPress={() => setKeluhan("Keterlambatan Bus")}
          >
            <Text style={styles.tagButtonText}>Keterlambatan Bus</Text>
          </TouchableOpacity>
       
        </View>

        <TextInput
          style={styles.input}
          placeholder="Tulis keluhan..."
          multiline
          value={keluhan}
          onChangeText={setKeluhan}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={{ color: "#fff" }}>Kirim Keluhan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: { fontWeight: "bold", marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  uploadBtn: {
    marginTop: 20,
    backgroundColor: "#3b6ef5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  preview: { width: "100%", height: 200, borderRadius: 8, marginTop: 10 },
  submitBtn: {
    marginTop: 25,
    backgroundColor: "#4266B9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  tagButton: {
  backgroundColor: "#4266B9",
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 8,
  marginRight: 10,
},
tagButtonText: {
  color: "#fff",
  fontSize: 12,
}
});
