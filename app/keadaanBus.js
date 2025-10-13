import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api"; // Axios instance

// Mapping crowded -> kondisi
const mapCrowdedToKondisi = (crowded) => {
  switch (crowded) {
    case 0:
      return "lega";
    case 1:
      return "sedang";
    case 2:
      return "penuh";
    default:
      return "lega";
  }
};

// Box kecil untuk status kapasitas
const CapacityBox = ({ color, label }) => (
  <View style={{ alignItems: "center", marginHorizontal: 8 }}>
    <View
      style={{
        width: 28,
        height: 28,
        backgroundColor: color,
        borderRadius: 8,
        marginBottom: 4,
      }}
    />
    <Text style={{ fontSize: 12, fontWeight: "600", color: "#333" }}>
      {label}
    </Text>
  </View>
);

// Card Bus
const BusCard = ({ nomorBus, rute, kondisi, updatedAt }) => {
  const kondisiMap = {
    lega: { color: "#4CAF50", label: "Lega" },
    sedang: { color: "#FFC107", label: "Sedang" },
    penuh: { color: "#F44336", label: "Penuh" },
  };

  const { color, label } = kondisiMap[kondisi] || {
    color: "#9E9E9E",
    label: "Unknown",
  };

  // Format timestamp ke hari, jam:menit:detik
  const formattedTime = updatedAt
    ? new Date(updatedAt).toLocaleString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "-";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 16,
        marginVertical: 10,
        marginHorizontal: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
        borderLeftWidth: 6,
        borderLeftColor: color,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>
          Bus Koridor {rute}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="bus"
            size={24}
            color="#673AB7"
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1976D2",
            }}
          >
            {nomorBus}
          </Text>
        </View>
      </View>

      {/* Capacity */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <CapacityBox
          color={kondisi === "lega" ? "#4CAF50" : "#E0E0E0"}
          label="Lega"
        />
        <CapacityBox
          color={kondisi === "sedang" ? "#FFC107" : "#E0E0E0"}
          label="Sedang"
        />
        <CapacityBox
          color={kondisi === "penuh" ? "#F44336" : "#E0E0E0"}
          label="Penuh"
        />
      </View>

      {/* Label status */}
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: "600",
          color,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      {/* Last updated */}
      <Text
        style={{
          fontSize: 12,
          color: "#777",
          textAlign: "right",
        }}
      >
        Terakhir diperbarui: {formattedTime}
      </Text>
    </View>
  );
};

// App utama
export default function App() {
  const router = useRouter();
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/tjData/getRealtimeData");
        if (res.data.success) {
          const sorted = res.data.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );

          const uniqueBuses = [];
          const seen = new Set();

          for (const bus of sorted) {
            if (!seen.has(bus.no_bus)) {
              seen.add(bus.no_bus);
              uniqueBuses.push({
                nomorBus: bus.no_bus,
                rute: bus.koridor,
                crowded: bus.crowded,
                kondisi: mapCrowdedToKondisi(bus.crowded),
                updatedAt: bus.timestamp,
              });
            }
          }

          setBusData(uniqueBuses);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          paddingTop: 25,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/")}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            textAlign: "center",
            flex: 1,
          }}
        >
          Ketersediaan Kursi BUS
        </Text>
      </View>

      {/* List Bus */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingVertical: 10,
          alignItems: "stretch",
          justifyContent: loading ? "center" : "flex-start",
          flexGrow: 1,
        }}
      >
        {loading ? (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <ActivityIndicator size="large" color="#673AB7" />
            <Text style={{ marginTop: 12, color: "#555" }}>
              Memuat data bus...
            </Text>
          </View>
        ) : busData.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Data kosong...
          </Text>
        ) : (
          busData.map((bus, index) => (
            <BusCard
              key={index}
              nomorBus={bus.nomorBus}
              rute={bus.rute}
              kondisi={bus.kondisi}
              updatedAt={bus.updatedAt}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
