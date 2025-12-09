import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useBookSession } from "./useBookSession";

export function BookSessionComponent() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [nombrePersonnes, setNombrePersonnes] = useState("");

  const { bookSession, error, isLoading, isSuccess } = useBookSession();

  const handleSubmit = async () => {
    await bookSession({
      nom,
      prenom,
      email,
      heureDebut,
      heureFin,
      nombrePersonnes,
    });
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Réservation Laser Quest</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Entrez votre nom"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          placeholder="Entrez votre prénom"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="exemple@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Heure de début</Text>
        <TextInput
          style={styles.input}
          value={heureDebut}
          onChangeText={setHeureDebut}
          placeholder="HH:MM"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Heure de fin</Text>
        <TextInput
          style={styles.input}
          value={heureFin}
          onChangeText={setHeureFin}
          placeholder="HH:MM"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de personnes</Text>
        <TextInput
          style={styles.input}
          value={nombrePersonnes}
          onChangeText={setNombrePersonnes}
          placeholder="Nombre de personnes"
          keyboardType="numeric"
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
          <Text style={styles.buttonText}>Réserver</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Réservation effectuée avec succès !</Text>
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