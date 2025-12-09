import { StyleSheet, ScrollView } from "react-native";
import { CreateSessionComponent } from "@/features/session/createSession/CreateSessionComponent";

export default function CreateSession() {
  return (
    <ScrollView style={styles.container}>
      <CreateSessionComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});