import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useStore } from "../../store/useStore";

export default function Home() {
  const { user, token, logout } = useStore();
  return (
    <View>
      <Text>{user?.username}</Text>
      <Text>{token}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
