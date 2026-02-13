import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APIURL = "https://backend-api-cuarta-uno.vercel.app";

type MedicalPet = {
  id_mascota: number;
  nombre_mascota: string;
  especie: string;
  raza: string;
  edad: number;
  historial_medico: string;
  nombre_propietario: string;
  telefono: string;
};

export default function MedicalPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<MedicalPet | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchMedicalPageModal = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch(`${APIURL}/api/v1/pets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          setError("No se pudo cargar la ficha médica.");
          return;
        }
        const data = await res.json();
        setPet(data.data);
      } catch (error) {
        setError("Error al obtener ficha médica.");
      }
    };
    fetchMedicalPageModal();
  }, [id]);
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }
  if (!pet) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ficha médica</Text>

        <View style={styles.card}>
          <Text style={styles.name}>{pet.nombre_mascota}</Text>
          <Text>
            {pet.especie} · {pet.raza}
          </Text>
          <Text>{pet.edad} años</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Historial médico</Text>
          <Text>{pet.historial_medico}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Propietario</Text>
          <Text>{pet.nombre_propietario}</Text>
          <Text>{pet.telefono}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  loading: {
    marginTop: 50,
    textAlign: "center",
  },
  error: {
    marginTop: 50,
    color: "red",
    textAlign: "center",
  },
});
