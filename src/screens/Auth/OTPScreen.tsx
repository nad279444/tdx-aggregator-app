import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OTPScreen({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: "OTP",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { mobile } = route.params;

  // Refs for each TextInput
  const otpRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input once the user enters a digit
    if (text && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOTP = () => {
    const otpCode = otp.join(""); // Combine digits into one OTP code
    navigation.navigate("ResetPassword", { otp: otpCode, mobile });
    setOtp(["", "", "", ""]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.text}>Enter Your TDX OTP</Text>
        <View style={styles.otpBoxes}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              ref={(el) => (otpRefs.current[index] = el)} // Set ref for each TextInput
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && index > 0 && !digit) {
                  otpRefs.current[index - 1].focus(); // Move to the previous input on backspace if empty
                }
              }}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={otp.every((digit) => digit) ? styles.greenButton : styles.disabledButton}
        onPress={handleOTP}
        disabled={otp.some((digit) => !digit) || isLoading}
      >
        <Text style={{ fontSize: 18, color: "white" }}>Send</Text>
        {isLoading && (
          <ActivityIndicator
            style={{ position: "absolute", top: 15, right: 40 }}
            size="small"
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  otpContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: "green",
    fontWeight: "bold",
  },
  otpBoxes: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  otpInput: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderColor: "green",
    textAlign: "center",
    fontSize: 18,
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginVertical: 50,
    height: 50,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginVertical: 50,
    height: 50,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
});
