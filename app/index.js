import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { UserContext } from "../context/UserContext";
import api from "../services/api"; 

export default function HomePage() {
  const router = useRouter();
  const { user, loading, logout } = useContext(UserContext);
  const [profileMenu, setProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("home");


  const [busPosition, setBusPosition] = useState(null);
  const [loadingBus, setLoadingBus] = useState(true);

  const stopPosition = {
    latitude: -6.2635,
    longitude: 106.8210,
  };


  useEffect(() => {
    if (!loading && !user) {
      router.replace("/onboarding");
    }
  }, [loading, user]);

 
  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const res = await api.get("/tjData/getRealtimeData");
        if (res.data.success && Array.isArray(res.data.data)) {
          const firstBus = res.data.data[0];
          if (firstBus && firstBus.latitude && firstBus.longitude) {
            setBusPosition({
              latitude: parseFloat(firstBus.latitude),
              longitude: parseFloat(firstBus.longitude),
              koridor: firstBus.koridor,
              no_bus: firstBus.no_bus,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching bus data:", err);
      } finally {
        setLoadingBus(false);
      }
    };

    fetchBusData();
    const interval = setInterval(fetchBusData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {activeTab === "home" ? (
        // ====================== HOME PAGE ======================
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() => setProfileMenu(!profileMenu)}
            >
              <View style={styles.iconProfile}>
                <Ionicons name="person" size={28} color="#fff" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.greeting}>Halo, selamat datang!</Text>
                <Text style={styles.brand}>Transzity</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.iconWrapper}>
              <Ionicons name="notifications-outline" size={22} color="#3b6ef5" />
            </TouchableOpacity> */}
          </View>

          {/* Dropdown Profile */}
          {profileMenu && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownEmail}>{user?.data?.user?.email}</Text>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={async () => {
                  await logout();
                  setProfileMenu(false);
                  router.replace("/onboarding");
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="red" />
                <Text style={[styles.dropdownText, { color: "red" }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Kartu Saldo */}
          <View style={styles.card}>
            <Text style={styles.cardDate}>12/10/2025</Text>
            <Text style={styles.cardBalance}>Rp 20.000</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Menu Navigasi */}
          <View style={styles.transport}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/ruteBus")}
            >
              <View style={[styles.iconWrapper, { backgroundColor: "#3b6ef5" }]}>
                <Ionicons name="bus" size={22} color="#fff" />
              </View>
              <Text style={styles.menuText}>Rute Bus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/keluhanPage")}
            >
              <View style={[styles.iconWrapper, { backgroundColor: "#3b6ef5" }]}>
                <Ionicons name="chatbubbles" size={22} color="#fff" />
              </View>
              <Text style={styles.menuText}>Keluhan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/keadaanBus")}
            >
              <View style={[styles.iconWrapper, { backgroundColor: "#3b6ef5" }]}>
                <Ionicons name="shield-checkmark" size={22} color="#fff" />
              </View>
              <Text style={styles.menuText}>Kondisi Bus</Text>
            </TouchableOpacity>
          </View>

          {/* ====================== RECENT TRIPS ====================== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perjalanan Terbaru</Text>

            <View style={styles.tripCard}>
              <Image
                source={require("../assets/images/map.png")}
                style={styles.map}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tripTitle}>Grand Indonesia</Text>
                <Text>Blok M → Bundaran HI</Text>
                <Text>Kepadatan: Sangat Padat</Text>
                <Text>Rute 1: Blok M - Kota</Text>
              </View>
              <Text style={styles.time}>45 Menit</Text>
            </View>

            <View style={styles.tripCard}>
              <Image
                source={require("../assets/images/map.png")}
                style={styles.map}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tripTitle}>Harmoni Central</Text>
                <Text>Ragunan → Monas</Text>
                <Text>Kepadatan: Lancar</Text>
                <Text>Rute 6: Ragunan - Dukuh Atas</Text>
              </View>
              <Text style={styles.time}>30 Menit</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        // ====================== MAP PAGE ======================
        <View style={{ flex: 1 }}>
          {loadingBus ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#3b6ef5" />
              <Text style={{ marginTop: 8 }}>Memuat posisi bus...</Text>
            </View>
          ) : !busPosition ? (
            <View style={styles.center}>
              <Text>Data posisi bus belum tersedia</Text>
            </View>
          ) : (
            <>
              <MapView
                style={{ flex: 1 }}
                region={{
                  latitude: busPosition.latitude,
                  longitude: busPosition.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                {/* Marker Bus */}
                <Marker coordinate={busPosition} title={`Bus ${busPosition.no_bus}`}>
                  <Image
                    source={require("../assets/images/busicon.png")}
                    style={{ width: 32, height: 32 }}
                  />
                </Marker>

                {/* Marker Halte */}
                <Marker coordinate={stopPosition} title="Halte" pinColor="blue" />

                <Polyline
                  coordinates={[busPosition, stopPosition]}
                  strokeColor="#007AFF"
                  strokeWidth={4}
                />
              </MapView>

              {/* Info Panel */}
              <View style={styles.infoPanel}>
                <Text style={styles.route}>
                  🚌 {busPosition.koridor || "Rute Tidak Diketahui"}
                </Text>
                <Text style={styles.arrival}>
                  {busPosition.no_bus
                    ? `Bus ${busPosition.no_bus} sedang dalam perjalanan`
                    : "Dalam perjalanan"}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* ====================== BOTTOM NAV ====================== */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveTab("home")}>
          <Ionicons
            name="home"
            size={26}
            color={activeTab === "home" ? "#3b6ef5" : "gray"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("map")}>
          <Ionicons
            name="map"
            size={26}
            color={activeTab === "map" ? "#3b6ef5" : "gray"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  profile: { flexDirection: "row", alignItems: "center" },
  greeting: { fontSize: 18, fontWeight: "bold" },
  brand: { color: "#3b6ef5", fontSize: 14 },
  iconProfile: {
    backgroundColor: "#3b6ef5",
    padding: 8,
    borderRadius: 50,
  },
  iconWrapper: {
    backgroundColor: "#e6edff",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 80,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  dropdownEmail: { fontSize: 13, color: "#333", marginBottom: 8 },
  dropdownItem: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  dropdownText: { marginLeft: 6, fontSize: 14, fontWeight: "500" },
  card: {
    backgroundColor: "#3b6ef5",
    borderRadius: 14,
    padding: 25,
    marginBottom: 30,
    position: "relative",
    minHeight: 200,
    justifyContent: "center",
  },
  cardDate: { color: "#fff", textAlign: "right", fontSize: 13, marginBottom: 120 },
  cardBalance: { color: "#fff", fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#5a87ff",
    borderRadius: 25,
    padding: 10,
  },
  transport: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  menuItem: { alignItems: "center" },
  menuText: { marginTop: 5, fontSize: 13 },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: "bold", marginBottom: 15, fontSize: 16 },
  tripCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  map: { width: 65, height: 65, borderRadius: 6 },
  tripTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 3 },
  time: { fontSize: 13, color: "purple" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  infoPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  route: { fontSize: 18, fontWeight: "bold" },
  arrival: { color: "gray", marginBottom: 10 },
});
