import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  nombre: string;
  email: string;
  telefono: string;
};

type Pet = {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
};

const APIURL = "https://backend-api-cuarta-uno.vercel.app";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoaded, setPetsLoaded] = useState(false);
  const [petsErr, setPetsErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        //petición datos de usuario, NO mascotas de ese usuario.
        const res = await fetch(`${APIURL}/api/v1/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
          return;
        }
        const data = await res.json();
        setUser(data.data);
        //obtener datos de las mascotas por usuario... get/pets/my
        const petsRes = await fetch(`${APIURL}/api/v1/pets/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!petsRes.ok) {
          console.error("Error al obtener mascotas de usuario");
          setPetsErr("No se pudieron cargar las mascotas.");
          // setPets([]);
          // setPetsLoaded(true);
          return;
        }
        const petsJson = await petsRes.json();
        setPets(petsJson.data);
        setPetsLoaded(true);
      } catch (error) {
        console.log("Error cargando datos usuario:", error);
        setPetsErr("Error al cargar las mascotas.");
        setPets([]);
        setPetsLoaded(true);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${APIURL}/api/v1/auth/logout`, {
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
  if (!user) {
    return <Text style={styles.loading}>Cargando perfil...</Text>;
  }
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil de usuario</Text>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.card}>
          <Text>
            <Text style={styles.bold}>Nombre: </Text>
            {user.nombre}
            <Text style={styles.bold}>Email: </Text>
            {user.email}
            <Text style={styles.bold}>Teléfono: </Text>
            {user.telefono}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mascotas</Text>
          {petsErr && <Text style={styles.errorText}> {petsErr} </Text>}
          {!petsErr && pets.length === 0 && (
            <Text style={styles.emptyText}>
              Actualmente no tienes mascotas registradas.
            </Text>
          )}

          {pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petInfo}>
                <Text style={styles.petName}> {pet.nombre} </Text>
                <Text style={styles.petMeta}>
                  -{pet.especie} | -{pet.raza} | -{pet.edad} años.
                </Text>
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
        <Pressable style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
    //     <View style={styles.container}>
    //       <Text style={styles.title}> Perfil de usuario</Text>
    //       <Image
    //         source={{
    //           uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    //         }}
    //         style={styles.avatar}
    //       />
    //       <View>
    //         <Text>
    //           <Text style={styles.bold}>Nombre:</Text> {user.nombre}
    //         </Text>
    //         <Text>
    //           <Text style={styles.bold}>Email:</Text> {user.email}
    //         </Text>
    //         <Text>
    //           <Text style={styles.bold}>Teléfono:</Text> {user.telefono}
    //         </Text>
    //       </View>
    //     </View>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    marginBottom: 24,
  },
  bold: {
    fontWeight: "bold",
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
  emptyText: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  errorText: {
    color: "#dc2626",
    marginBottom: 8,
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
  logout: {
    backgroundColor: "#6a0303",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loading: {
    marginTop: 50,
    textAlign: "center",
  },
});
