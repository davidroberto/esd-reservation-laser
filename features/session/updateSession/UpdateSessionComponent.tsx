import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useUpdateSession } from "./useUpdateSession";
import { useGetSession, fakeFetchGetSession } from "./useGetSession";
import {fakeFetchSuccess} from "@/features/shared/fetch";

type UpdateSessionComponentProps = {
  sessionId: string;
}

export function UpdateSessionComponent({ sessionId }: UpdateSessionComponentProps) {
  const [dateHeureDebut, setDateHeureDebut] = useState("");
  const [duree, setDuree] = useState("");
  const [nombreKartsDisponibles, setNombreKartsDisponibles] = useState("");
  const [prix, setPrix] = useState("");

  const { session, error: fetchError, isLoading: isFetching } = useGetSession(sessionId, fakeFetchGetSession);
  const { updateSession, error, isLoading, isSuccess } = useUpdateSession(fakeFetchSuccess);

  useEffect(() => {
    if (session) {
      setDateHeureDebut(session.dateHeureDebut);
      setDuree(session.duree.toString());
      setNombreKartsDisponibles(session.nombreKartsDisponibles.toString());
      setPrix(session.prix.toString());
    }
  }, [session]);

  const handleSubmit = async () => {
      await updateSession({
        sessionId,
        dateHeureDebut: new Date(dateHeureDebut),
        duree: parseInt(duree),
        nombreKartsDisponibles: parseInt(nombreKartsDisponibles),
        prix: parseFloat(prix),
      });

  };

  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de la session...</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.formContainer}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Modifier une Session Karting</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date et Heure de début</Text>
        <TextInput
          style={styles.input}
          value={dateHeureDebut}
          onChangeText={setDateHeureDebut}
          placeholder="YYYY-MM-DD HH:MM"
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
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Modifier la session</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Session modifiée avec succès !</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
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
