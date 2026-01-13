import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { UpdateSessionComponent } from "@/features/session/updateSession/UpdateSessionComponent";

export default function UpdateSession() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return (
    <ScrollView style={styles.container}>
      <UpdateSessionComponent sessionId={sessionId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
