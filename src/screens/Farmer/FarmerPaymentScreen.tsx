import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  TextInput,
  Modal,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import { DataContext } from "../../../DBContext";
import { orders } from "../../controllers/api/orders";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default function FarmerPaymentScreen({ navigation }) {
  const [disclaimer, setDisclaimer] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [momoName, setMomoName] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [mainNumber, setMainNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const { data, updateData } = useContext(DataContext);

  useEffect(() => {
    navigation.setOptions({
      title: "Sell To Direct",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false);

    if (option === "Farmer's Momo Number") {
      setMomoName(data.farmerName); // Assuming data contains a 'farmerName' field
      setMomoNumber(data.phoneNumber); // Assuming data contains a 'farmerNumber' field
    } else {
      setMomoName("");
      setMomoNumber("");
    }
  };

  const handleNext = async () => {
   setIsLoading(true)
    try {
      const response = await orders.post({
        payto:  momoNumber === data.phoneNumber ? "mainNumber":"altNumber",
        commodity: data.commodityId,
        farmer: data.farmerToken,
        community_id: data.communityId,
        siloid: data.siloId,
        quantity: data.weight,
        bags: data.bags,
        commodity_qc: data.qualityControlChecks,
      });
     
      if (!response.error) {
        ToastAndroid.showWithGravityAndOffset(
          response.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
        navigation.navigate("CompleteScreen");
      } else {
        ToastAndroid.showWithGravityAndOffset(
          response.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        );
        navigation.navigate("");
      }

      
      setMomoName("");
      setMomoNumber("");
    } catch (error) {
      // Handle the error
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        50
      )

      // Log the error for debugging
      console.error("Error in handleNext:", error);
    }finally{
      setIsLoading(false)
    }
  };

  const validatePhone = (input) => {
    const phoneRegex = /^\d{10}$/; // Exactly 10 digits
    return phoneRegex.test(input);
  };
  const handlePhoneChange = (input) => {
    setMomoNumber(input);
    if (validatePhone(input)) {
      setPhoneError("");
    } else {
      setPhoneError("✗ Invalid number.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Black Box */}
        <View style={styles.blackBox}>
       
          <View style={styles.commodityContainer}>
             <Image source={{uri:data.icon}} style={styles.icon}/>
            <View style={{ marginLeft: 5 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
                {data.commodity}
              </Text>
              <Text
                style={{ color: "#94E081", fontSize: 14, fontWeight: "500" }}
              >
                {data.bags} bags, {data.weight} KG
              </Text>
            </View>
          </View>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "500" }}>
          ₵{data.totalPrice}
          </Text>
        </View>

        {/* Green Box */}
        <View style={styles.greenBox}>
          <Text style={{ textAlign: "center", fontWeight: "condensed" }}>
            Payment for{" "}
          </Text>
          <Text
            style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
          >
            {data.farmerName}
          </Text>
        </View>

        {/* Payment Details */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          Payment Details
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginTop: 5,
            marginLeft: 20,
          }}
        >
          Pay To
        </Text>
        <TouchableOpacity
          onPress={() => setDropdownVisible(true)}
          style={styles.inputWrapper}
        >
          <TextInput
            style={[styles.commodityInput, { color: "black" }]}
            textAlign="left"
            editable={false}
            value={selectedOption}
            placeholder="Select an option"
          />
          <Ionicons
            name="chevron-down"
            size={20}
            color="gray"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
              style={styles.nameInput}
              textAlign="left"
              placeholder="Enter Full Name"
              onChangeText={(text) => setMomoName(text)}
              value={momoName}
            />
          </View>
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputTitle}>Phone Number</Text>
            <TextInput
              style={styles.nameInput}
              textAlign="left"
              placeholder="Enter Your Phone Number"
              onChangeText={handlePhoneChange}
              keyboardType="numeric"
              value={momoNumber}
            />
          </View>
        </View>
        {phoneError ? (
          <Text style={{ color: "red", marginLeft: 20,marginTop: 5 }}>{phoneError}</Text>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <CheckBox
            checked={disclaimer}
            onPress={() => setDisclaimer((prev) => !prev)}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
            checkedIcon={<Ionicons name="checkbox" size={24} color="green" />}
            uncheckedIcon={
              <Ionicons name="square-outline" size={24} color="black" />
            }
            checkedColor="green"
            uncheckedColor="black"
          />
          <Text style={{ textAlign: "center", marginRight: 60, marginTop: 15 }}>
            I confirm that the information provided is accurate.
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={disclaimer ? styles.greenButton : styles.button}
          onPress={handleNext}
          disabled={!disclaimer || isLoading}
        >
          <Text style={{ fontSize: 18, color: "white" }}>Continue</Text>
          {isLoading &&   <ActivityIndicator style={{position: 'absolute',top: 15, right: 30}} size="small" color="#fff" />}
        </TouchableOpacity>

        {/* Dropdown Modal */}
        <Modal
          transparent={true}
          visible={dropdownVisible}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect("Farmer's Momo Number")}
              >
                <Text style={styles.optionText}>Farmer's Momo Number</Text>
              </TouchableOpacity>
              <Divider style={{ borderWidth: 1 }} />
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect("Different Momo Number")}
              >
                <Text style={styles.optionText}>Different Momo Number</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  commodityContainer: {
    flexDirection: "row",
  },
  blackBox: {
    height: hp('14'),
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 50,
  },
  commodityImage: {
    marginLeft: 20,
    marginTop: 5,
    width: 35,
    height: 40,
  },
  greenBox: {
    height: hp('10'),
    backgroundColor: "#94E08180",
    justifyContent: "center",
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 5,
    height: hp('7'),
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
    position:'relative'
  },
  button: {
    marginTop: 5,
    height: hp('7'),
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
    marginTop: 5,
  },
  commodityInput: {
    height: hp('7'),
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,

    paddingRight: 35,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  chevronIcon: {
    position: "absolute",
    right: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    marginHorizontal: 30,
    borderRadius: 8,
    padding: 20,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  inputTitle: {
    marginLeft: 20,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  nameInput: {
    height: hp('7'),
    borderWidth: 1,
    borderColor: "#0000001A",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 20,
    textAlign: "right",
    backgroundColor: "#0000001A",
  },
  checked: {
    position: "absolute",
    right: 35,
    bottom: 15,
  },
  icon: {
    width:35,
    height:40,
    marginLeft:10,
    marginTop:5

  }
});
