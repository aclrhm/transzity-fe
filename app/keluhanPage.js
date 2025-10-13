import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserContext } from "../context/UserContext";
import api from "../services/api";

export default function KeluhanPage() {
  const router = useRouter();
  const [keluhanList, setKeluhanList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [activeTab, setActiveTab] = useState("explore");
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [loading, setLoading] = useState(true); // <- tambah loading
  const { user } = useContext(UserContext);

  const userId = user?.data?.user?.uid;

  const getKeluhan = async () => {
    try {
      setLoading(true); // mulai loading
      const res = await api.get("/report/getAllReport");
      setKeluhanList(res.data);
      setFilteredList(res.data);
    } catch (err) {
      console.error("Gagal ambil keluhan:", err.message);
    } finally {
      setLoading(false); // selesai loading
    }
  };

  useEffect(() => {
    getKeluhan();
  }, []);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === "explore") {
      setFilteredList(keluhanList);
    } else {
      setFilteredList(keluhanList.filter((k) => k.id_user === userId));
    }
  }, [activeTab, keluhanList, userId]);

  const formatDate = (dateInput) => {
    const d = new Date(dateInput);
    if (!d || isNaN(d)) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/report/deleteReport/${id}`);
      setKeluhanList((prev) => prev.filter((item) => item.id !== id));
      setMenuVisibleId(null);
    } catch (err) {
      console.error("Gagal hapus keluhan:", err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.id_user === userId;
    const username = isMine
      ? "Anda"
      : item.user?.email
      ? item.user.email
      : "Anonim";

    return (
      <View style={styles.card}>
        {/* Header user info */}
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle" size={36} color="#3b6ef5" />
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{username}</Text>
             <Text style={styles.timestamp}>{formatDate(item.created_at)}</Text>
          </View>

          {isMine && (
            <TouchableOpacity
              onPress={() =>
                setMenuVisibleId(menuVisibleId === item.id ? null : item.id)
              }
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* Isi keluhan */}
        <Text style={styles.text}>{item.keluhan_text}</Text>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <Ionicons name="bus" size={16} color="#555" />
          <Text style={styles.metaText}>Bus {item.nomor_bus}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location" size={16} color="#555" />
          <Text style={styles.metaText}>{item.rute}</Text>
        </View>

        {/* Dropdown menu */}
        {menuVisibleId === item.id && (
          <View style={styles.menuBox}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.menuDelete}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keluhan</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Toggle Tab */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "explore" && styles.toggleActive,
          ]}
          onPress={() => setActiveTab("explore")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "explore" && styles.toggleTextActive,
            ]}
          >
            Jelajahi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "mine" && styles.toggleActive,
          ]}
          onPress={() => setActiveTab("mine")}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === "mine" && styles.toggleTextActive,
            ]}
          >
            Keluhan Saya
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#3b6ef5" />
          <Text style={{ marginTop: 10, color: "#555" }}>Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#777" }}>
              Belum ada keluhan
            </Text>
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/tambahKeluhan")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop:  25
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3b6ef5",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  toggleActive: {
    backgroundColor: "#3b6ef5",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b6ef5",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  username: { fontWeight: "bold", fontSize: 14 },
  timestamp: { fontSize: 12, color: "#888" },
  text: { marginBottom: 10, fontSize: 15, lineHeight: 20 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  metaText: { fontSize: 13, marginLeft: 5, color: "#555" },
  menuBox: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#eee",
    alignSelf: "flex-end",
  },
  menuDelete: {
    color: "red",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#3b6ef5",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
});
