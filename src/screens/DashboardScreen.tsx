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

export default function DashboardScreen({ navigation }) {
  const { profile } = useContext(ProfileContext);
  const [agg, setAgg] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const {unreadCount} = usePushNotifications()
  const [isOnline,setIsOnline] = useState(false)
 
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


  

  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const localData = await getAllOrders.loadJsonFromFile();
            if (localData) {
                setOrderList(localData.data);
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
          setLoading(true)
            try {
                await getAllOrders.fetchAndSync();
                const localData = await getAllOrders.loadJsonFromFile();
                if (localData) {
                    setOrderList(localData.data);
                } else {
                    console.log("No local data available after sync.");
                }
            } catch (error) {
                console.error("Error syncing data:", error);
            } finally {
              setLoading(false)
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
            const localData = await dashboard.loadJsonFromFile();
            if (localData) {
                setAgg(localData.data);
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
          setLoading(true)
            try {
                await dashboard.fetchAndSync();
                const localData = await dashboard.loadJsonFromFile();
                if (localData) {
                    setAgg(localData.data);
                } else {
                    console.log("No local data available after sync.");
                }
            } catch (error) {
                console.error("Error syncing data:", error);
            } finally {
              setLoading(false)
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : (
        <View style={styles.dashboardContainer}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Hello {profile?.firstname ?? ""}
          </Text>
          <View style={[styles.greenCard, { position: "relative" }]}>
            <View style={{ padding: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
              >
                Available Balance
              </Text>
              <TouchableOpacity
                style={{ position: "absolute", right: 40, top: 20 }}
                onPress={async () => {
                  await dashboard.loadJsonFromFile();
                }}
              >
                <Ionicons name="refresh-circle" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ position: "absolute", right: 80, top: 23 }}
              >
               <NotificationIcon unreadCount={unreadCount} onPress={() => navigation.navigate('NotificationScreen')}/> 
              </TouchableOpacity>
              
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "white",
                  marginTop: 5,
                }}
              >
                ₵{agg?.account_balance}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 40,
                }}
              >
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
            title="Total Quantities Sold         "
            content={agg?.total_quantity ?? "0 KG"}
          />
          <TouchableOpacity
            style={styles.greenButton}
            onPress={() => navigation.navigate("SellToTDXScreen")}
          >
            <Text style={styles.buttonText2}>Sell To TDX </Text>
          </TouchableOpacity>
        </View>
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
    </View>
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
    height: 50,
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
    height: 200,
    backgroundColor: "green",
    marginTop: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  listContainer: {
    width: "100%",
    height: 100,
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
    width: 80,
    height: 40,
    borderRadius: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 25,
    height: 50,
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
