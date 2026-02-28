import { API_URL } from "@/src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Pet = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
};

export default function PetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fecthPets = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return router.replace("/login");
      try {
        const res = await fetch(`${API_URL}/api/v1/pets/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError("Error cargando tus mascotas.");
          return;
        }
        setPets(data.data);
      } catch (error) {
        console.log("Error cargando mascotas:", error);
        setError("Error de conexión.");
      }
    };
    fecthPets();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mascotas</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Tus Mascotas</Text>
          {error && <Text style={styles.errorText}> {error} </Text>}
          {!error && pets.length === 0 && (
            <Text style={styles.emptyText}>
              Actualmente no tienes mascotas registradas.
            </Text>
          )}
          {pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.nombre}</Text>
                <Text style={styles.petMeta}>{pet.especie}</Text>
                <Text style={styles.petMeta}>{pet.raza}</Text>
                <Text style={styles.petMeta}>{pet.edad}</Text>
              </View>
              <Pressable
                style={styles.petButton}
                onPress={() => {
                  router.push({
                    pathname: "/pets/[id]",
                    params: { id: pet.id },
                  });
                }}
              >
                <Text style={styles.petButtonText}>Ver ficha</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
  },
  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  petCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  petInfo: {
    flex: 1,
    marginRight: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: "600",
  },
  petMeta: {
    color: "#6b7280",
    marginTop: 4,
  },
  petButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
  },
  petButtonText: {
    color: "#2563eb",
    fontWeight: "500",
  },
});
