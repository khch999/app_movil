import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const APIURL = "https://backend-api-cuarta-uno.vercel.app";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`${APIURL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión.");
        return;
      }
      //guardar token
      await AsyncStorage.setItem("token", data.data.token);
      //guardar rol
      await AsyncStorage.setItem("rol", data.data.user.rol);
      router.replace("/(tabs)/home");
    } catch (error) {
      setError("Error de conexión con el servidor.");
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://img.freepik.com/iconos-gratis/candado_318-790509.jpg",
        }}
        style={styles.image}
      />

      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Correo"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            pressed && { backgroundColor: "#e5e7eb" },
          ]}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    gap: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  form: {
    width: "85%",
    maxWidth: 420,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    gap: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
