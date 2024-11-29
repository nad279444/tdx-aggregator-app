import React, { useEffect, useContext, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ProfileContext } from "../../ProfileContext";
import { dashboard } from "../controllers/api/aggregates";
import { getAllOrders } from "../controllers/api/orders";
import BottomSheet from "@gorhom/bottom-sheet";
import { Divider } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import NotificationIcon from "./Notification/NotificationIcon";
import { usePushNotifications } from "../functions/useNotifications";
import NetInfo from '@react-native-community/netinfo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default function DashboardScreen({ navigation }) {
  const { profile } = useContext(ProfileContext);
  const [agg, setAgg] = useState({});
  const [loading, setIsLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const {unreadCount} = usePushNotifications()
  const [isOnline,setIsOnline] = useState(false)
  const  [timeedOut,setTimedOut] = useState(false) 
  useEffect(() => {
    navigation.setOptions({
      title: "Dashboard",
      headerTitleAlign: "center",
      headerLeft: () => {},
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


  const TIMEOUT_DURATION = 10000; // 10 seconds timeout

  const loadLocalData = async (loader, setter, fallbackMessage) => {
    try {
      const localData = await loader();
      if (localData) {
        setter(localData.data);
      } else {
        console.log(fallbackMessage || "No local data available.");
      }
    } catch (error) {
      console.error("Error loading data from local storage:", error);
    }
  };

  const handleNetworkChange = async (isConnected, syncFunction, loader, setter, fallbackMessage) => {
    setIsOnline(isConnected);
    if (isConnected) {
      try {
        setIsLoading(true);

        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Network operation timed out")), TIMEOUT_DURATION)
        );
        const syncOperation = syncFunction();

        await Promise.race([syncOperation, timeout]);

        const localData = await loader();
        if (localData) {
          setter(localData.data);
        } else {
          console.log(fallbackMessage || "No local data available after sync.");
        }
      } catch (error) {
        console.error("Error syncing data:", error);
        // Ensure local data is loaded on failure
        await loadLocalData(loader, setter, fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load local data when offline
      await loadLocalData(loader, setter, fallbackMessage);
    }
  };

  useEffect(() => {
    // Load orders on component mount
    loadLocalData(
      getAllOrders.loadJsonFromFile,
      setOrderList,
      "No local orders data available."
    );

    const handleDashboardNetworkChange = (isConnected) =>
      handleNetworkChange(
        isConnected,
        getAllOrders.fetchAndSync,
        getAllOrders.loadJsonFromFile,
        setOrderList,
        "No local orders data available after sync."
      );

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      handleDashboardNetworkChange(state.isConnected);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  useEffect(() => {
    // Load aggregation data on component mount
    loadLocalData(
      dashboard.loadJsonFromFile,
      setAgg,
      "No local dashboard data available."
    );

    const handleAggNetworkChange = (isConnected) =>
      handleNetworkChange(
        isConnected,
        dashboard.fetchAndSync,
        dashboard.loadJsonFromFile,
        setAgg,
        "No local dashboard data available after sync."
      );

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      handleAggNetworkChange(state.isConnected);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const handleShowOrders = () => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand(); // Expands the BottomSheet
  };

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    bottomSheetRef.current?.close(); // Closes the BottomSheet
  };

  const renderOrderList = () => (
    <View style={styles.bottomSheetContent}>
      <TouchableOpacity
        onPress={handleCloseBottomSheet}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.orderTitle}>Recent Orders</Text>
      <ScrollView>
        {orderList.map((item) => (
          <View key={item.order_tnx}>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Farmer</Text>
              <Text style={{ color: "green", fontSize: 15 }}>
                {item.farmer}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Quantity</Text>
              <Text style={styles.orderData}>{item.quantity}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Total Cost</Text>
              <Text style={styles.orderData}>₵{item.total_cost}</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Payment Status</Text>
              <View style={styles.pending}>
                <Text style={styles.orderData}>{item.paymentstatus}</Text>
              </View>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Created At</Text>
              <Text style={styles.orderData}>
               {item.created_at.split(" ")} 
              </Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Divider color="white" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <>
      {loading ? (
        // Show the ActivityIndicator while loading
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.dashboardContainer}>
              <Text style={{ fontSize: wp('5'), fontWeight: "bold" }}>
                Hello {profile?.firstname ?? ""}
              </Text>
              <View style={[styles.greenCard, { position: "relative" }]}>
                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                    Available Balance
                  </Text>
                  <TouchableOpacity
                    style={{ position: "absolute", right: wp('5'), top: hp('2.5') }}
                    onPress={async () => {
                      await handleNetworkChange(
                        isOnline,
                        getAllOrders.fetchAndSync,
                        getAllOrders.loadJsonFromFile,
                        setOrderList,
                        "No local orders data available after sync."
                      );
                    }}
                  >
                    <Ionicons name="refresh-circle" size={40} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ position: "absolute", right: wp('15'), top: hp('2.8') }}
                  >
                    <NotificationIcon unreadCount={unreadCount} onPress={() => navigation.navigate('NotificationScreen')} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 28, fontWeight: "bold", color: "white", marginTop: 5 }}>
                    ₵{agg?.account_balance}
                  </Text>
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 40 }}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleShowOrders}
                    >
                      <Ionicons name="cart" size={20} color="white" />
                      <Text style={styles.addButtonText}> Recent Orders </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <DashboardList
                icon="user-alt"
                button={() => navigation.navigate("ManageFarmersScreen")}
                title="Total Farmers Onboarded"
                content={`${agg?.total_users ?? 0} farmers`}
              />
              <DashboardList
                icon="hand-holding-usd"
                button={() => navigation.navigate("MyAggregatesScreen")}
                title="Total Cash Transactions"
                content={`₵${agg?.total_cost ?? 0} `}
              />
              <DashboardList
                icon="weight"
                button={() => navigation.navigate("AggregatorQuantitiesScreen")}
                title="Total Quantities Sold"
                content={agg?.total_quantity ?? "0 KG"}
              />
              <TouchableOpacity
                style={styles.greenButton}
                onPress={() => navigation.navigate("SellToTDXScreen")}
              >
                <Text style={styles.buttonText2}>Sell To TDX</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
  
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsBottomSheetOpen(false)}
        backgroundStyle={styles.bottomSheetBackground}
      >
        {renderOrderList()}
      </BottomSheet>
    </>
  );
  
}

const DashboardList = ({ icon, button, title, content }) => {
  return (
    <View style={styles.listContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <View style={styles.iconContainer}>
          <FontAwesome5 name={icon} size={30} color="black" />
        </View>
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={styles.listTitle}>{title}</Text>
          <Text style={styles.listContent}>{content}</Text>
        </View>
        <TouchableOpacity onPress={button} style={styles.viewButton}>
          <Text style={{ color: "white" }}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  dashboardContainer: {
    margin: 15,
  },
  addButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    height: hp('7'),
    backgroundColor: "#45A455",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#EFEFEF",
    justifyContent: "center",
    alignItems: "center",
  },
  greenCard: {
    width: "100%",
    height: hp('27'),
    backgroundColor: "green",
    marginTop: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  listContainer: {
    width: "100%",
    height: hp('12.5'),
    backgroundColor: "white",
    marginTop: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 14,
  },
  listContent: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  viewButton: {
    width: wp('17'),
    height: hp('5.5'),
    borderRadius: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 25,
    height: hp('7'),
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSheetContent: {
    padding: 20,
    marginBottom: 50,
  },
  bottomSheetBackground: {
    backgroundColor: "#221D1D",
  },
  orderTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "white",
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderData: {
    color: "white",
  },
  pending: {
    width: 70,
    height: 25,
    borderRadius: 5,
    backgroundColor: "#ECC63E",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
