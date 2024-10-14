import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orders } from '../controllers/api/orders';
import BottomSheet from "@gorhom/bottom-sheet";
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

const CompleteScreen = ({ route, navigation }) => {
  const [orderList, setOrderList] = useState([]);
  const bottomSheetRef = useRef(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("FarmerPaymentScreen")}
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

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const data = await orders.getAllOrders(); 
        setOrderList(data); 
      } catch (error) {
        console.error("Error fetching commodities: ", error);
      }
    };
    fetchAllOrders();
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
      <TouchableOpacity onPress={handleCloseBottomSheet} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.orderTitle}>List of Orders</Text>
      <ScrollView>
        {orderList.map((item) => (
          <View key={item.order_tnx}>
            <View style={styles.orderItem}>
              <Text style={styles.orderData}>Farmer</Text>
              <Text style={{color:'green',fontSize:15}}>{item.farmer}</Text>
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
              <Text style={styles.orderData}>{item.created_at.split(' ')[0]}</Text>
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
      <FontAwesome5 name="heart" size={60} color="#21893E" solid />
      <Text style={styles.title}> Thank you for Selling to TDX ! </Text>
      <Text style={styles.message}>
        We'll process your sales order as soon as possible. We will keep you updated on the progress through the app.
      </Text>
      <View style={{ width: '100%', position: 'absolute', bottom: 50 }}>
        <TouchableOpacity style={styles.greenButton} onPress={handleShowOrders}>
          <Text style={styles.buttonText2}>View Order Status</Text>
        </TouchableOpacity>
      </View>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    marginHorizontal: 70,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  greenButton: {
    backgroundColor: "#21893E",
    marginTop: 5,
    height: 50,
    marginHorizontal: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  bottomSheetContent: {
    padding: 20,
    marginBottom:50,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderData: {
    color: 'white',
  },
  pending: {
    width: 70,
    height: 25,
    borderRadius: 5,
    backgroundColor: '#ECC63E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CompleteScreen;
