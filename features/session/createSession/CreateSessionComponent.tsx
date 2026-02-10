import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useCreateSession } from "./useCreateSession";
import {fakeFetchSuccess} from "@/features/shared/fetch";

export function CreateSessionComponent() {
  const [dateHeureDebut, setDateHeureDebut] = useState("");
  const [duree, setDuree] = useState("");
  const [nombreKartsDisponibles, setNombreKartsDisponibles] = useState("");
  const [prix, setPrix] = useState("");

  const { createSession, error, isLoading, isSuccess } = useCreateSession(fakeFetchSuccess);

  const handleSubmit = async () => {
      await createSession({
        dateHeureDebut: new Date(dateHeureDebut),
        duree: parseInt(duree),
        nombreKartsDisponibles: parseInt(nombreKartsDisponibles),
        prix: parseFloat(prix),
      });

  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Créer une Session Karting</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date et Heure de début</Text>
        <TextInput
          style={styles.input}
          value={dateHeureDebut}
          onChangeText={setDateHeureDebut}
          placeholder="YYYY-MM-DD HH:MM"
          testID="test-input-dateHeureDebut"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Durée (en minutes)</Text>
        <TextInput
          style={styles.input}
          value={duree}
          onChangeText={setDuree}
          placeholder="30"
          keyboardType="numeric"
          testID="test-input-duree"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de karts disponibles</Text>
        <TextInput
          style={styles.input}
          value={nombreKartsDisponibles}
          onChangeText={setNombreKartsDisponibles}
          placeholder="10"
          keyboardType="numeric"
          testID="test-input-nombreKartsDisponibles"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Prix (€)</Text>
        <TextInput
          style={styles.input}
          value={prix}
          onChangeText={setPrix}
          placeholder="25.00"
          keyboardType="decimal-pad"
          testID="test-input-prix"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        testID="test-creer"
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Créer la session</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Session créée avec succès</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  successText: {
    color: "#2e7d32",
    fontSize: 14,
  },
});