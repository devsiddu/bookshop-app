import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useStore } from "../../store/useStore";

export default function Home() {
  const { user, token } = useStore();
  return (
    <View>
      <TouchableOpacity>
        <Text>{user?.username}</Text>
        <Text>{token}</Text>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
