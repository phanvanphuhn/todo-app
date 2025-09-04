import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useAuthStore } from "../../stores/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const { currentUser, updateAvatar } = useAuthStore();

  const onUploadAvatar = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to upload your avatar!"
      );
      return;
    }

    // Show action sheet to choose between camera and library
    Alert.alert("Select Avatar", "Choose how you want to upload your avatar", [
      {
        text: "Camera",
        onPress: () => pickImage("camera"),
      },
      {
        text: "Photo Library",
        onPress: () => pickImage("library"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const pickImage = async (source: "camera" | "library") => {
    try {
      let result;

      if (source === "camera") {
        // Request camera permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need camera permissions to take a photo!"
          );
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={onUploadAvatar}
      >
        {currentUser?.avatar ? (
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatarImage}
          />
        ) : (
          <MaterialCommunityIcons name="human-male" size={80} color="black" />
        )}
        <View style={styles.cameraButton}>
          <AntDesign name="pluscircle" size={24} color="black" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{currentUser?.username}</Text>
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    borderRadius: 99,
    backgroundColor: "cyan",
    height: 160,
    width: 160,
  },
  cameraButton: {
    position: "absolute",
    bottom: 16,
    right: 8,
  },
  avatarImage: {
    width: 160,
    height: 160,
    borderRadius: 99,
  },
});
