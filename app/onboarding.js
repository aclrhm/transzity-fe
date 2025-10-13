import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>

        <Image
          source={require("../assets/images/image.png")}
          style={styles.busImage}
          resizeMode="contain"
        />

        <Text style={styles.smartCityText}>SmartCity</Text>
        <Text style={styles.brandText}>Transzity</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("/signUp")}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4266B9",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  busImage: {
    width: 300,
    height: 150,
    marginBottom: 5,
  },
  smartCityText: {
    fontSize: 18,
    color: "white",
  },
  brandText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: "white",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#4266B9",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupButton: {
    borderWidth: 1.5,
    borderColor: "white",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
