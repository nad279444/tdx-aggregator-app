import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { DataContext } from "../../../DBContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  ScrollView as SC
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import BottomSheet from "@gorhom/bottom-sheet";
import { useDataContext } from "../../../DBContext";
import { commodities } from "../../controllers/api/commodities";
import { autoCalculator } from "../../controllers/api/priceCalculator";
import { silos } from "../../controllers/api/silos";
import { ScrollView } from "react-native-gesture-handler";
import NetInfo from '@react-native-community/netinfo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';




const SellToTDXScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSiloVisible, setModalSiloVisible] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedCommodityIcon,setSelectedCommodityIcon] = useState("")
  const [selectedSilo, setSelectedSilo] = useState("");
  const [selectedSiloId, setSelectedSiloId] = useState("");
  const [selectedCommodityId, setSelectedCommodityId] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [commodityRates, setCommodityRates] = useState([]);
  const [siloList, setSiloList] = useState([]);
  const [bags, setBags] = useState("");
  const [bagsRate, setBagsRate] = useState("");
  const [surplusKg, setSurplusKg] = useState("");
  const [weight, setWeight] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [loading, setLoading] = useState(false); //
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const { data, updateData } = useDataContext();
  const [isOnline,setIsOnline] = useState(false)
  console.log(weight,selectedCommodityId)


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
    const loadLocalData = async () => {
        try {
            const localData = await commodities.loadJsonFromFile();
            if (localData) {
                setCommodityRates(localData.data);
            } else {
                console.log("No local data available.");
            }
        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
    };

    const handleNetworkChange = async (isConnected) => {
        setIsOnline(isConnected);
        if (isConnected) {
            try {
                await commodities.fetchAndSync();
                const localData = await commodities.loadJsonFromFile();
                if (localData) {
                    setCommodityRates(localData.data);
                } else {
                    console.log("No local data available after sync.");
                }
            } catch (error) {
                console.error("Error syncing data:", error);
            }
        }
    };

    // Load local data immediately on component mount (offline-first)
    loadLocalData();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
        handleNetworkChange(state.isConnected);
    });

    // Clean up the event listener
    return () => unsubscribe();
}, []);


useEffect(() => {
  const loadLocalData = async () => {
      try {
          const localData = await silos.loadJsonFromFile();
          if (localData) {
              setSiloList(localData.data);
          } else {
              console.log("No local data available.");
          }
      } catch (error) {
          console.error("Error loading data from local storage:", error);
      }
  };

  const handleNetworkChange = async (isConnected) => {
      setIsOnline(isConnected);
      if (isConnected) {
          try {
              await silos.fetchAndSync();
              const localData = await silos.loadJsonFromFile();
              if (localData) {
                  setSiloList(localData.data);
              } else {
                  console.log("No local data available after sync.");
              }
          } catch (error) {
              console.error("Error syncing data:", error);
          } 
      }
  };

  // Load local data immediately on component mount (offline-first)
  loadLocalData();

  // Listen for network status changes
  const unsubscribe = NetInfo.addEventListener(state => {
      handleNetworkChange(state.isConnected);
  });

  // Clean up the event listener
  return () => unsubscribe();
}, []);


  useEffect(() => {
    const fetchAutoCalculatedData = async () => {
      try {
        const { bags, totalcost, message, bagsrate, remainingkg } =
          await autoCalculator.get(weight, selectedCommodityId);
        setBags(bags);
        setBagsRate(bagsrate);
        setSurplusKg(remainingkg);
        setTotalCost(totalcost);
      } catch (error) {
        console.error("Error fetching auto-calculated data: ", error);
      }
    };

    fetchAutoCalculatedData(); // Call the async function
  }, [weight, selectedCommodityId]); // Add dependencies if necessary

  const handleSelectCommodity = (commodity, commodityId,commodityIcon) => {
    console.log(commodityId)
    setSelectedCommodity(commodity);
    setSelectedCommodityId(commodityId);
    setSelectedCommodityIcon(commodityIcon)
    setModalVisible(false);
  };

  const handleSelectSilo = (siloName, siloId) => {
    setSelectedSilo(siloName);
    setSelectedSiloId(siloId);
    setModalSiloVisible(false);
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
    updateData("commodity", selectedCommodity);
    updateData("commodityId", selectedCommodityId);
    updateData("icon", selectedCommodityIcon);
    updateData("siloId", selectedSiloId);
    updateData("weight", weight);
    updateData("bags", bags);
    updateData("totalPrice", totalCost);
    navigation.navigate("FarmerDetailScreen");
    setSelectedCommodity("");
    setBags("");
    setWeight("");
    setTotalCost("");
    setSelectedSilo("");
    setSelectedSiloId("");
  };

  const renderMarketPrices = () => (
    <View style={styles.bottomSheetContent}>
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
      <ScrollView>
      {commodityRates.map((item) => (
        <View key={item.commodityId} style={styles.marketItem}>
          <View>
            <Text style={styles.marketItemText}>{item.name}</Text>
            <Text style={{ color: "#94E081", fontSize: 16 }}>
              Last Updated: 2/4/2024
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={styles.marketItemPrice}>High</Text>
              <View
                style={{
                  width: wp('11'),
                  height: hp('3'),
                  backgroundColor: "green",
                  borderRadius: 5,
                  padding: 2,
                }}
              >
                <Text style={{ color: "white" }}>
                ₵{item.purchaseprice_high}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={styles.marketItemPrice}>Low </Text>
              <View
                style={{
                  width: wp('11'),
                  height: hp('3'),
                  backgroundColor: "#ECC63E",
                  borderRadius: 5,
                  padding: 2,
                }}
              >
                <Text style={{ color: "white" }}>
                ₵{item.purchaseprice_low}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      </ScrollView>
    </View>
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
          value={selectedCommodity}
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
            value={weight}
            onChangeText={(text) => setWeight(text)}
          />
          <Text style={styles.weightLabel}>KG</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.commodityLabel}>Silo </Text>
          <TouchableOpacity
            onPress={() => setModalSiloVisible(true)}
            style={styles.inputWrapper}
          >
            <TextInput
              style={[styles.bags, { color: selectedSilo ? "black" : "grey" }]}
              textAlign="left"
              placeholder="Select Silo"
              keyboardType="numeric"
              value={selectedSilo}
              editable={false}
            />
            <Ionicons
              name="chevron-down"
              size={20}
              color="gray"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: hp('20'),
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
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>No.of Bags(100KG)</Text>
          <Text style={{ fontSize: 16 }}>{bags}</Text>
        </View>
        <Divider />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Price Per KG</Text>
          <Text style={{ fontSize: 16 }}> ₵{bagsRate}</Text>
        </View>
        <Divider />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>Total Cost</Text>
          <Text style={{ fontSize: 16 }}> ₵{totalCost}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={totalCost ? styles.greenButton : styles.button}
        onPress={handleNext}
        disabled={!totalCost}
      >
        <Text style={{ fontSize: 18, color: totalCost ? "white" : "#969696" }}>
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
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)} // Close modal when background is clicked
        >
          <View style={styles.modalContent}>
            <FlatList
              data={commodityRates}
              keyExtractor={(item) => item.commodityId}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{ width: 500 }}
                  onPress={() =>
                    handleSelectCommodity(item.name, item.commodityId,item.icon)
                  }
                >
                  <View style={styles.modalItems}>
                    <View>
                      <Text style={styles.modalItem}>{item.name}</Text>
                    </View>
                  </View>
                  <Divider style={styles.divider} />
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSiloVisible}
        onRequestClose={() => setModalSiloVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalSiloVisible(false)} // Close modal when background is clicked
        >
          <View style={styles.modalContent}>
            <FlatList
              data={siloList}
              keyExtractor={(item) => item.token}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={{ width: 500 }}
                  onPress={() => handleSelectSilo(item.siloname, item.token)}
                >
                  <View style={styles.modalItems}>
                    <View>
                      <Text style={styles.modalItem}>{item.siloname}</Text>
                    </View>
                  </View>
                  {index !== siloList.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
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
    height: hp('7'),
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
    gap: -10,
    marginTop: 20,
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 30,
    height: hp('7'),
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D5D8DE",
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: "center",
  },
  weight: {
    height: hp('7'),
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 12,
    textAlign: "right",
    backgroundColor: "#FFFFFF",
  },
  bags: {
    height: hp('7'),
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
    height: hp('7'),
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
    left: wp('27'),
    top: hp('10'),
    marginTop: 20,
    height: hp('6'),
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
    marginBottom:50
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
