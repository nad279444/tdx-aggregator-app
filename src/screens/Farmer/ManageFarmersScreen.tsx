import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { DataContext } from "../../../DBContext";
import { farmers as farmersApi } from "../../controllers/api/farmerList";
import NetInfo from '@react-native-community/netinfo';


const ManageFarmersScreen = ({ navigation }) => {
  interface PaymentNumbers {
    main: string;
    altrnumber: string;
  }

  interface Farmer {
    token: string;
    first_name: string;
    last_name: string;
    paymentnumbers: PaymentNumbers;
  }
  
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { getFarmers } = useContext(DataContext);
  const [isOnline,setIsOnline] = useState(false)


  useEffect(() => {
    navigation.setOptions({
      title: "Farmers",
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

  const handleNetworkChange = async (isConnected) => {
    setIsOnline(isConnected);
    if (isConnected) {
        try {
            setIsLoading(true);
            await farmersApi.fetchAndSync();
            const localData = await farmersApi.loadJsonFromFile();
            if (localData) {
                setFilteredFarmers(localData.data);
            } else {
                console.log("No local data available after sync.");
            }
        } catch (error) {
            console.error("Error syncing data:", error);
        } finally {
            setIsLoading(false);
        }
    }
};
  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const localData = await farmersApi.loadJsonFromFile();
            if (localData) {
                setFilteredFarmers(localData.data);
            } else {
                console.log("No local data available.");
            }
        } catch (error) {
            console.error("Error loading data from local storage:", error);
        }
    };

    handleNetworkChange(isOnline)

    // Load local data immediately on component mount (offline-first)
    loadLocalData();

    // Listen for network status changes
    const unsubscribe = NetInfo.addEventListener(state => {
        handleNetworkChange(state.isConnected);
    });

    // Clean up the event listener
    return () => unsubscribe();
}, []);


  
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    const filteredData = farmers.filter(
      (farmer) => 
        farmer.first_name?.toLowerCase().includes(text.toLowerCase()) ||
        farmer.last_name?.toLowerCase().includes(text.toLowerCase()) ||
        farmer.paymentnumbers.main?.toLowerCase().includes(text.toLowerCase()) ||
        `${farmer.first_name} ${farmer.last_name}`.toLowerCase().includes(text.toLowerCase()) 
        
    );
    setFilteredFarmers(filteredData);
  };

  const renderAvatar = (item) => {
    if (item.profile_photo_path) {
      return (
        <Avatar
          rounded
          source={{ uri: item.profile_photo_path }}
          size="medium"
          containerStyle={styles.avatar}
        />
      );
    } else {
      return (
        <View style={styles.placeholderIcon}>
          <Ionicons name="person" size={30} color="white" />
        </View>
      );
    }
  };
  
  const renderItem = ({ item }) => (
    <View style={styles.farmerListContainer}>
      <View style={styles.leftContent}>
        {renderAvatar(item)}
        <View style={styles.textContainer}>
          <Text style={styles.notificationText}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.farmerInfo}>{item.paymentnumbers.main}</Text>
        </View>
      </View>
      <FontAwesome5
        name="chevron-right"
        size={18}
        color="gray"
        style={styles.chevronIcon}
      />
    </View>
  );
   
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>All Farmers</Text>
        <TouchableOpacity onPress={()=> handleNetworkChange(isOnline)}>
        <Ionicons name="refresh" size={24}/>
        </TouchableOpacity>
        
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.searchInput}
            onChangeText={handleSearch}
            value={searchQuery}
            placeholder="Search for Farmer..."
            placeholderTextColor="gray"
          />
          <Ionicons
            name="search"
            size={26}
            color="grey"
            style={{ position: "absolute", right: 25, bottom: 15 }}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={styles.loader}
        />
      ) : (
        <>
          {filteredFarmers.length === 0 ? (
            <Text style={styles.noItemsText}>No farmers available</Text>
          ) : (
            <FlatList
              data={filteredFarmers}
              keyExtractor={(item) => item.token.toString()}
              renderItem={renderItem}
              onEndReached={() => {
                if (!isLoading && hasMore) {
                  setPage(page + 1);
                }
              }}
              onEndReachedThreshold={0.1}
            />
          )}
        </>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFarmerScreen')}>
        <Text style={styles.addButtonText}> Add New Farmer </Text>
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFF",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  farmerListContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 5, // Square avatar with rounded corners
  },
  placeholderIcon: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#E6E6E6",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
  },
  notificationText: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  farmerInfo: {
    fontSize: 14,
    color: "gray",
  },
  searchInput: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    marginHorizontal: 10,
    paddingLeft: 10,
    backgroundColor: "#FFFFFF",
  },
  noItemsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
    position: "absolute",
    bottom: 40,
    right: 20,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  chevronIcon: {
    alignSelf: "flex-end",
    marginBottom: 18,
    marginRight: 2,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    flex: 1,
    position: "relative",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManageFarmersScreen;
