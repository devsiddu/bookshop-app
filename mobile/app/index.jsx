import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../context/AppContext";

export default function Index() {
  const { user, token, logout } = useAppContext();

  return (
    <View style={styles.container}>
      <Text>Hello {user ? user?.username : "Developer"}</Text>
      <Link href={"/(auth)"}>Login</Link>
      <Link href={"/(auth)/register"}>Register</Link>

      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "red" },
});
