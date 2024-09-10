import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import auth from "../../controllers/auth/auth";
import { Ionicons } from "@expo/vector-icons";
import OTPInputView from "@twotalltotems/react-native-otp-input";

export default function OTPScreen({ navigation,route }) {
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
  const [otp, setOtp] = useState("");
  const {mobile} = route.params

  
  

  async function handleReset() {
    setIsLoading(true);
    try {
      console.log(mobile)
      const response = await auth.confirmOTP({otp,mobile});
    

      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.challenge,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
      }
      ToastAndroid.showWithGravityAndOffset(
        response.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      );
    } finally {
      setIsLoading(false);
    }
    navigation.navigate("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.text}>Enter Your TDX OTP</Text>
        <OTPInputView
          style={styles.otpView}
          pinCount={4}
          code={otp} // set OTP if needed
          onCodeChanged={(code) => setOtp(code)} // updates OTP on change
          autoFocusOnLoad
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighlighted}
          onCodeFilled={(code) => {
            console.log(`OTP entered: ${code}`);
          }}
        />
      </View>

      <TouchableOpacity
        style={otp ? styles.greenButton : styles.disabledButton}
        onPress={handleReset}
        disabled={!otp || isLoading}
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

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "green",
    marginLeft: 10,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 10,
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
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  otpContainer: {
    alignItems: "center",
  },

  text: {
    fontSize: 20,
    marginBottom: 20,
    color: 'green',
    fontWeight: 'condensedBold'
  },
  otpView: {
    width: "80%",
    height: 200,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderColor: "green",
    color: "green",
    borderBottomWidth: 3,
    borderBottomColor: 'green'
  },
  underlineStyleHighlighted: {
    borderColor: "#03DAC6",
  },
});
