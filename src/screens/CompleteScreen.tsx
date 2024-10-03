import React,{useEffect,useState,useMemo,useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import { FontAwesome5,Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orders } from '../controllers/api/orders';
import BottomSheet from "@gorhom/bottom-sheet";



const CompleteScreen = ({ route, navigation }) => {
  const [orderList,setOrderList] = useState([])
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
        List of Orders
      </Text>
      {orderList.map((item) => (
        <View key={item.commo_no} style={{}}>
          
        </View>
      ))}
    </ScrollView>
  );
    return(
    <View style={styles.container}>
      <FontAwesome5 name="heart" size={60} color="#21893E" solid/>
      <Text style={styles.title}> Thank you for Selling to TDX ! </Text>
      <Text style={styles.message}>We'll process your sales order as soon as possible. We will keep you updated on the progress through the app.</Text>
      <View style={{width:'100%',position:'absolute',bottom:50}} >
      <TouchableOpacity
          style={styles.greenButton }
          onPress={handleShowOrders}
        >
          <Text style={{ fontSize: 18, color: 'white' }}>View Order Status</Text>
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
      position:'relative'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      textAlign: 'center',
      marginHorizontal:70
    },
    message: {
      fontSize: 18,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    nxtButton: {
      marginTop: 30,
      backgroundColor: '#fff', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      color:"#fff",
      width:200,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nxtButton2:{
      marginTop: 10,
      backgroundColor: 'green', // White background
      borderWidth: 1,
      borderColor: 'green', // Green border
      borderRadius: 2,
      width:200,
      height: 50,
      
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#006400', // Green text
      fontSize: 16,
      fontWeight: 'bold',
    },

    buttonText2: {
        color: '#fff', // Green text
        fontSize: 16,
        fontWeight: 'bold',
      },
      greenButton: {
        backgroundColor: "#21893E",
        marginTop: 5,
        height: 50,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#D5D8DE",
        borderRadius: 4,
        paddingVertical: 10,
        alignItems: "center",
      },
      closeButton: {
        alignSelf: "flex-end",
        padding: 5,
        color: "white",
      },
      bottomSheetContent: {
        padding: 20,
      },
      bottomSheetBackground: {
        backgroundColor: "#221D1D",
      },
  });
  
  export default CompleteScreen;