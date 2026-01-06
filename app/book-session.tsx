import { ScrollView, StyleSheet } from "react-native";
import { BookSessionComponent } from "@/features/session/bookSession/BookSessionComponent";

export default function BookSession() {
  return (
    <ScrollView style={styles.container}>
      <BookSessionComponent />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
