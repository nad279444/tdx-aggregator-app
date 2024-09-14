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
import PasswordInput from "../../_components/PasswordInput";
import auth from "../../controllers/auth/auth";
import { AuthContext } from "../../../AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPassword({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      title: "Log In",
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authContext } = useContext(AuthContext);
  const { otp, mobile } = route.params;

  async function handleReset() {
    setIsLoading(true);
    try {
      const response = await auth.confirmOTP({
        otp,
        mobile,
        password,
        confirmpassword:confirmPassword,
      });
        
      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          'password was unable to reset',
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
      navigation.navigate('SignIn')
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
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Type in a New Paasword</Text>

        <PasswordInput
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          styles={styles}
        />
       
        <TouchableOpacity
          style={password ? styles.greenButton : styles.disabledButton}
          onPress={handleReset}
          disabled={!password || isLoading}
        >
          <Text style={{ fontSize: 18, color: "white" }}>Reset Password</Text>
          {isLoading && (
            <ActivityIndicator
              style={{ position: "absolute", top: 15, right: 40 }}
              size="small"
              color="#fff"
            />
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    position: "relative",
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 10,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  visibleIcon: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  nameInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 10,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  validationContainer: {
    marginTop: 10,
    marginLeft: 10,
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
    marginVertical: 20,
    height: 50,
    marginHorizontal: 25,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  disabledButton: {
    marginVertical: 20,
    height: 50,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginLeft: 10,
    marginTop: 5,
  },
});
