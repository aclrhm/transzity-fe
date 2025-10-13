// RuteBus.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "../services/api";

export default function RuteBus() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ambil semua rute
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get("/brt/listRoutes");
        setRoutes(res.data);
      } catch (err) {
        console.error("Gagal ambil rute", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  // ambil detail rute
  const fetchDetail = async (number) => {
    try {
      setLoading(true);
      const res = await api.get(`/brt/listRoutes/${number}`);
      setSelectedRoute(res.data);
    } catch (err) {
      console.error("Gagal ambil detail rute", err);
    } finally {
      setLoading(false);
    }
  };

  // filter search
  const filteredRoutes = routes.filter(
    (r) =>
      r.number.toLowerCase().includes(search.toLowerCase()) ||
      r.route_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 10, color: "#555" }}>Memuat data...</Text>
        </View>
      ) : !selectedRoute ? (
        <>
          {/* Header dengan back + title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Rute Transjakarta</Text>
            <View style={{ width: 24 }} /> 
          </View>

          {/* Search bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nomor atau nama rute..."
            value={search}
            onChangeText={setSearch}
          />

          {/* List semua rute */}
          <FlatList
            data={filteredRoutes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => fetchDetail(item.number)}
              >
                <View style={styles.routeNumberBox}>
                  <Text style={styles.routeNumber}>{item.number}</Text>
                </View>
                <Text style={styles.routeName}>{item.route_name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        // Jika sudah pilih rute → tampilkan detail
        <View style={styles.detailWrapperFull}>
          {/* Header dengan tombol back */}
          <View style={styles.detailHeader}>
            <TouchableOpacity onPress={() => setSelectedRoute(null)}>
              <Ionicons name="arrow-back" size={26} color="#1d4ed8" />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>
              Rute {selectedRoute.number}
            </Text>
          </View>

          <Text style={styles.detailTitle}>{selectedRoute.route_name}</Text>
          <Text style={styles.detailDirection}>
            Arah: {selectedRoute.direction}
          </Text>

          <Text style={styles.detailSubtitle}>Halte yang dilewati</Text>
          <ScrollView
            style={styles.stopsList}
            showsVerticalScrollIndicator={false}
          >
            {selectedRoute.stops?.map((stop, idx) => (
              <View key={idx} style={styles.stopItem}>
                <View style={styles.timeline}>
                  <View style={styles.circle} />
                  {idx !== selectedRoute.stops.length - 1 && (
                    <View style={styles.line} />
                  )}
                </View>
                <Text style={styles.stopText}>{stop}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // biar bisa center dengan trik
    marginBottom: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },

  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: "#f9fafb",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3b82f6",
    elevation: 2,
  },
  routeNumberBox: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  routeNumber: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  routeName: { fontSize: 16, flexShrink: 1, color: "#111" },

  detailWrapperFull: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#1d4ed8",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },
  detailDirection: { fontSize: 15, marginBottom: 10, color: "#333" },
  detailSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1d4ed8",
  },
  stopsList: { marginTop: 6 },
  stopItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  timeline: { width: 20, alignItems: "center" },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#3b82f6",
    marginTop: 2,
  },
  stopText: { fontSize: 15, marginLeft: 8, color: "#111", flexShrink: 1 },
});
