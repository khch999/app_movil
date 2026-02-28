import { API_URL } from "@/src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

type Pet = {
  id: number;
  nombre: string;
};

export default function NewDate() {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState("");
  const [motive, setMotive] = useState("");
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const fetchAvailability = async (date: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/dates/available?fecha=${date}`,
      );
      const data = await res.json();
      setAvailableHours(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchPets = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/v1/pets/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setPets(data.data);
    };
    fetchPets();
  }, []);
  const handleCreateDate = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/v1/dates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fecha: selectedDate,
          hora: selectedHour,
          motivo: motive,
          mascota_id: selectedPetId,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al crear la cita");
        return;
      }
      router.replace("/(tabs)/dates");
    } catch (error) {
      console.log("Error creando cita:", error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flex: 1, padding: 20 }}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedHour("");
              fetchAvailability(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#4CAF50",
              },
            }}
          />
          <Text style={{ marginTop: 20, fontSize: 18 }}>
            Horas disponibles:
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}
          >
            {availableHours.map((hour) => (
              <TouchableOpacity
                key={hour}
                onPress={() => setSelectedHour(hour)}
                style={{
                  padding: 10,
                  margin: 5,
                  backgroundColor: selectedHour === hour ? "#4CAF50" : "#ccc",
                  borderRadius: 5,
                }}
              >
                <Text>{hour}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ marginTop: 20, fontSize: 18 }}>
            Selecciona mascota:
          </Text>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              onPress={() => setSelectedPetId(pet.id)}
              style={{
                padding: 10,
                marginVertical: 5,
                backgroundColor: selectedPetId === pet.id ? "#4CAF50" : "#ccc",
                borderRadius: 5,
              }}
            >
              <Text>{pet.nombre}</Text>
            </TouchableOpacity>
          ))}
          <Text style={{ marginTop: 20, fontSize: 18 }}>
            Motivo de la cita:
          </Text>
          <TextInput
            value={motive}
            onChangeText={setMotive}
            placeholder="Ej: Vacunación, fractura, ..."
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,
              padding: 10,
              marginTop: 10,
            }}
          />
          {selectedDate && selectedHour && selectedPetId && motive && (
            <TouchableOpacity
              onPress={handleCreateDate}
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: "#2196F3",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Confirmar cita
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
