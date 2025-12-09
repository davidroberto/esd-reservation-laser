import { StyleSheet, ScrollView } from "react-native";
import { BookSessionComponent } from "@/features/session/createSession/BookSessionComponent";

export default function Reservation() {
  return (
    <ScrollView style={styles.container}>
      <BookSessionComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});