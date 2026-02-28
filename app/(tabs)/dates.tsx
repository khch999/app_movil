import { API_URL } from "@/src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DataItem = {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  motivo: string;
  mascota: string;
};
export default function DatesPage() {
  const [dates, setDates] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const rol = await AsyncStorage.getItem("rol");
        if (!token || !rol) {
          setError("Sesión inválidada.");
          setLoading(false);
          return;
        }
        setRole(rol);
        const endpoints =
          rol === "admin"
            ? `${API_URL}/api/v1/dates`
            : `${API_URL}/api/v1/dates/my`;
        const res = await fetch(endpoints, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setError("No se pudieron cargar las citas.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setDates(data.data);
        setLoading(false);
      } catch {
        setError("Error de conexión.");
        setLoading(false);
      }
    };
    fetchDates();
  }, []);
  if (loading) {
    return (
      <SafeAreaView>
        <Text>Cargando citas...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mis citas</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {dates.length === 0 && !error && (
          <Text style={styles.empty}>No tienes citas registradas.</Text>
        )}
        {dates.map((date) => (
          <View key={date.id} style={styles.card}>
            <Text style={styles.bold}>{date.mascota ?? "Mascota"}</Text>
            <Text>
              Fecha: {new Date(date.fecha).toLocaleDateString("es-CR")}{" "}
            </Text>
            <Text>Hora: {date.hora}</Text>
            <Text>Estado: {date.estado}</Text>
          </View>
        ))}
        {role === "owner" && (
          <TouchableOpacity
            onPress={() => router.push("/new-date")}
            style={{
              marginTop: 20,
              padding: 15,
              backgroundColor: "#4CAF50",
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
            >
              Agendar nueva cita
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  bold: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  empty: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  error: {
    color: "#dc2626",
    marginBottom: 12,
  },
});
