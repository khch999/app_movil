import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type User = {
  nombre: string;
  email: string;
  telefono: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch("http://10.0.2.2:4000/api/v1/auth/profile", {
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://10.0.2.2:4000/api/v1/auth/logout", {
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
    <View style={styles.container}>
      <Text style={styles.title}> Perfil de usuario</Text>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        }}
        style={styles.avatar}
      />
      <View>
        <Text>
          <Text style={styles.bold}>Nombre:</Text> {user.nombre}
        </Text>
        <Text>
          <Text style={styles.bold}>Email:</Text> {user.email}
        </Text>
        <Text>
          <Text style={styles.bold}>Teléfono:</Text> {user.telefono}
        </Text>
      </View>
      <Pressable style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  card: {
    width: 260,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  logout: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
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
