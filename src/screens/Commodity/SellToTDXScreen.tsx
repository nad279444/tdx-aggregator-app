import React, { useEffect, useState, useRef, useMemo,useContext } from "react";
import { DataContext } from "../../../DataProvider";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import BottomSheet from "@gorhom/bottom-sheet";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const SellToTDXScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState({});
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bags, setBags] = useState(0);
  const [weight, setWeight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const {data,updateData} = useContext(DataContext)
  

  useEffect(() => {
    navigation.setOptions({
      title: "Sell To TDX",
      headerTitleAlign: "center",

      headerLeft: () => null,

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

  useEffect(() => {
    if (selectedCommodity.price && weight > 0) {
      setTotalPrice(weight * selectedCommodity.price);
    }
  }, [weight, selectedCommodity]);

  const commodities = [
    { name: "Maize", icon: require("../../../assets/Maize.jpg"), price: 20 },
    {
      name: "Soybean",
      icon: require("../../../assets/Soybean.jpg"),
      price: 60,
    },
    {
      name: "Sesame Seeds",
      icon: require("../../../assets/SesemeSeeds.jpg"),
      price: 70,
    },
    {
      name: "GroundNut",
      icon: require("../../../assets/GroundNut.jpg"),
      price: 80,
    },
  ];

  const handleSelectCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setModalVisible(false);
  };

  const handleShowPrices = () => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand(); // Expands the BottomSheet
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    bottomSheetRef.current?.close(); // Closes the BottomSheet
  };

  const handleNext = () => {
    updateData('commodity', selectedCommodity?.name);
    updateData('weight', weight);
    updateData('bags',bags)
    updateData('totalPrice',totalPrice)
    navigation.navigate("FarmerDetailScreen");
    setSelectedCommodity('');
    setBags(0);
    setWeight(0)
    setTotalPrice(0);
  };


  const renderMarketPrices = () => (
    <ScrollView contentContainerStyle={styles.bottomSheetContent}>
      <TouchableOpacity
        onPress={handleCloseBottomSheet}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "400",
          color: "white",
        }}
      >
        Prices
      </Text>
      {commodities.map((item) => (
        <View key={item.name} style={styles.marketItem}>
          <Image source={item.icon} style={styles.marketImage} />

          <View>
            <Text style={styles.marketItemText}>{item.name}</Text>
            <Text style={{ color: "#94E081", fontSize: 16 }}>
              Last Updated: 2/4/2023
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.marketItemPrice}>{item.price}₵/KG</Text>

            <View
              style={{
                width: 35,
                height: 25,
                backgroundColor: "#ECC63E",
                borderRadius: 5,
                padding: 2,
              }}
            >
              <Text style={{ color: "white" }}>+4₵</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.commodityLabel}>Commodity</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.inputWrapper}
      >
        <TextInput
          style={[
            styles.commodityInput,
            { color: selectedCommodity ? "black" : "grey" },
          ]}
          placeholder="Select Commodity"
          placeholderTextColor="grey"
          textAlign="left"
          editable={false}
          value={selectedCommodity?.name}
        />
        <Ionicons
          name="chevron-down"
          size={20}
          color="gray"
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.commodityLabel}>Weight</Text>
          <TextInput
            style={styles.weight}
            textAlign="left"
            placeholder="0"
            keyboardType="numeric"
            value={String(weight)}
            onChangeText={(text) => setWeight(parseFloat(text) || 0)}
          />
          <Text style={styles.weightLabel}>KG</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.commodityLabel}>Bags</Text>
          <TextInput
            style={styles.bags}
            textAlign="left"
            placeholder="0"
            keyboardType="numeric"
            value={String(bags)}
            onChangeText={(text) => setBags(parseFloat(text) || 0)}
          />
          <Text style={styles.bagsLabel}>Bags</Text>
        </View>
      </View>

      <View
        style={{
          height: 100,
          backgroundColor: "#E1EFFF",
          borderRadius: 10,
          marginHorizontal: 12,
          marginTop: 20,
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Price Per KG</Text>
          <Text style={{ fontSize: 16 }}>{selectedCommodity.price}₵/KG</Text>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Total Price</Text>
          <Text style={{ fontSize: 16 }}>{totalPrice}₵</Text>
        </View>
      </View>

      <TouchableOpacity
        style={totalPrice ? styles.greenButton : styles.button}
        onPress={handleNext}
        disabled={!totalPrice}
      >
        <Text style={{ fontSize: 18, color: totalPrice ? "white" : "#969696" }}>
          Continue
        </Text>
      </TouchableOpacity>

      <View style={{ position: "relative" }}>
        <TouchableOpacity
          style={styles.showPricesButton}
          onPress={handleShowPrices}
        >
          <Text style={styles.showPricesButtonText}>Show Prices</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsBottomSheetOpen(false)}
        backgroundStyle={styles.bottomSheetBackground}
      >
        {renderMarketPrices()}
      </BottomSheet>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={commodities}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ width: 500 }}
                  onPress={() => handleSelectCommodity(item)}
                >
                  <View style={styles.modalItems}>
                    <Image source={item.icon} style={styles.modalImage} />
                    <View>
                      <Text style={styles.modalItem}>{item.name}</Text>
                      <Text>{item.price}₵/KG</Text>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  commodityLabel: {
    marginLeft: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  commodityInput: {
    height: 50,
    marginHorizontal: 12,
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
    right: 20,
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
  greenButton: {
    backgroundColor: "#21893E",

    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  weight: {
    height: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 12,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  bags: {
    height: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 12,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  weightLabel: {
    position: "absolute",
    right: 20,
    bottom: 15,
  },
  bagsLabel: {
    position: "absolute",
    right: 20,
    bottom: 15,
  },
  button: {
    marginTop: 30,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#D5D8DE",
    alignItems: "center",
  },
  showPricesButton: {
    position: "absolute",
    left: 110,
    top: 250,
    marginTop: 20,
    height: 50,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#53C4672E",
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: "#53C4672E",

    alignItems: "center",
    width: 140,
  },
  showPricesButtonText: {
    fontSize: 16,
    color: "#0B8A46",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    paddingBottom: 50,
  },
  modalItems: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,

    width: "100%", // Ensure full width for the items
  },
  modalImage: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  modalItem: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  divider: {
    width: "100%", // Ensure the divider takes up full width
    borderBottomWidth: 2,
    borderBottomColor: "#D5D8DE", // Adjust color as needed
    marginVertical: 5,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetBackground: {
    backgroundColor: "#221D1D",
  },
  marketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  marketImage: {
    width: 40,
    height: 40,
    marginRight: 15,
    marginTop: 10,
    borderRadius: 40,
  },
  marketItemText: {
    fontSize: 16,
    flex: 1,
    color: "white",
  },
  marketItemPrice: {
    fontSize: 18,
    color: "white",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
    color: "white",
  },
});

export default SellToTDXScreen;
