import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "../../assets/styles/login.style";
import IMAGE from "../../constants/images";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Link } from "expo-router";
import { useAppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { axios, isLoading, setIsLoading, user, token, router } =
    useAppContext();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        await AsyncStorage.setItem("user", data.user);
        await AsyncStorage.setItem("token", data.token);
        router.back();
        setIsLoading(false);
      } else {
        Alert.alert("Error", data.message);
        console.log("login error:" + data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("login server error:" + error.message);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.topIllustration}>
          <Image
            source={IMAGE.i}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ironman@gmail.com"
                  placeholderTextColor={COLORS.placeholderText}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                {/* LEFT ICON */}
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                {/* INPUT */}
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have a account ?</Text>
                <Link href={"/register"} asChild>
                  <TouchableOpacity>
                    <Text style={styles.link}> Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
