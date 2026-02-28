import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const handleLogout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${API_URL}/api/v1/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        {/* Perfil */}
        <Pressable style={styles.card} onPress={() => router.push("/profile")}>
          <View style={styles.cardContent}>
            <MaterialIcons name="person" size={28} color="#111827" />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Perfil</Text>
              <Text style={styles.cardSubtitle}>Ver información personal.</Text>
            </View>
          </View>
        </Pressable>
        {/* Mascotas */}
        <Pressable style={styles.card} onPress={() => router.push("/pets")}>
          <View style={styles.cardContent}>
            <MaterialIcons name="pets" size={28} color="#111827" />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Mascotas</Text>
              <Text style={styles.cardSubtitle}>Ver info de tus mascotas.</Text>
            </View>
          </View>
        </Pressable>
        {/* Citas */}
        <Pressable style={styles.card} onPress={() => router.push("/dates")}>
          <View style={styles.cardContent}>
            <MaterialIcons name="event" size={28} color="#111827" />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Citas</Text>
              <Text style={styles.cardSubtitle}>
                Ver tus mascotas registradas y ficha médica.
              </Text>
            </View>
          </View>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
  },
  logoutButton: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "d1d5db",
  },
  logoutText: {
    fontWeight: "600",
    color: "#374151",
  },
});
