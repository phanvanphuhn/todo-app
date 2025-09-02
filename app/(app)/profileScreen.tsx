import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../../stores/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function ProfileScreen() {
  const { currentUser } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentUser?.username}</Text>
      <View style={styles.profileContainer}>
        <MaterialCommunityIcons name="human-male" size={48} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 48,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 99,
    backgroundColor: "#007AFF",
  },
});
