import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useBookSession } from "./useBookSession";

import {fakeFetch} from "@/features/shared/fetch";

// Sessions fictives pour la démo
const FAKE_SESSIONS = [
  { id: 1, label: "Session 1 - Lundi 10h-12h" },
  { id: 4, label: "Session 4 - Mardi 14h-16h" },
  { id: 28, label: "Session 28 - Mercredi 18h-20h" },
  { id: 42, label: "Session 42 - Jeudi 10h-12h" },
  { id: 76, label: "Session 76 - Vendredi 14h-16h" },
  { id: 77, label: "Session 77 - Samedi 10h-12h" },
  { id: 78, label: "Session 78 - Samedi 14h-16h" },
  { id: 79, label: "Session 79 - Dimanche 10h-12h" },
];

export function BookSessionComponent() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [nombreParticipants, setNombreParticipants] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);

  // idéalement, on utiliserait un système comme le context
  // pour définir à un seul endroit quel fetch on utilise pour tous
  // nos hooks : vrai (pour la prod) ou fake (pour les tests / démo)
  const { bookSession, error, isLoading, isSuccess } = useBookSession(fakeFetch);

  const handleSessionToggle = (sessionId: number) => {
    setSelectedSessions((prev) => {
      if (prev.includes(sessionId)) {
        return prev.filter((id) => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  };

  const handleSubmit = async () => {
    await bookSession({
      nom,
      prenom,
      email,
      telephone,
      nombreParticipants: parseInt(nombreParticipants) || 0,
      sessionIds: selectedSessions,
    });
  };

  const isFormValid =
    nom.trim() !== "" &&
    prenom.trim() !== "" &&
    email.trim() !== "" &&
    telephone.trim() !== "" &&
    nombreParticipants.trim() !== "" &&
    selectedSessions.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réserver une session</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          value={nom}
          onChangeText={setNom}
          placeholder="Votre nom"
          editable={!isLoading}
        />

        <Text style={styles.label}>Prénom *</Text>
        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
          placeholder="Votre prénom"
          editable={!isLoading}
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="votre.email@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <Text style={styles.label}>Téléphone *</Text>
        <TextInput
          style={styles.input}
          value={telephone}
          onChangeText={setTelephone}
          placeholder="06 44 44 44 44"
          keyboardType="phone-pad"
          editable={!isLoading}
        />

        <Text style={styles.label}>Nombre de participants * (1-10)</Text>
        <TextInput
          style={styles.input}
          value={nombreParticipants}
          onChangeText={setNombreParticipants}
          placeholder="Nombre de participants"
          keyboardType="number-pad"
          editable={!isLoading}
        />

        <Text style={styles.label}>Sélectionnez vos sessions * (max 3)</Text>
        <View style={styles.sessionsContainer}>
          {FAKE_SESSIONS.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionItem,
                selectedSessions.includes(session.id) &&
                  styles.sessionItemSelected,
              ]}
              onPress={() => handleSessionToggle(session.id)}
              disabled={isLoading}
            >
              <View style={styles.checkbox}>
                {selectedSessions.includes(session.id) && (
                  <View style={styles.checkboxChecked} />
                )}
              </View>
              <Text
                style={[
                  styles.sessionLabel,
                  selectedSessions.includes(session.id) &&
                    styles.sessionLabelSelected,
                ]}
              >
                {session.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isSuccess && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Réservation créée avec succès !
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Réserver</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  sessionsContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  sessionItemSelected: {
    backgroundColor: "#e6f2ff",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  sessionLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  sessionLabelSelected: {
    fontWeight: "600",
    color: "#007AFF",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
    fontWeight: "500",
  },
  successContainer: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  successText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
});
