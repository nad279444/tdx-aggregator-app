import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommunityPricesCard from '../../_components/CommunityPricesCard';
import { communityRates } from '../../controllers/api/communities';
import BottomSheet from "@gorhom/bottom-sheet";
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function CommunityPricesScreen({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      title: 'Community Prices',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight: 16 }}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [communityPrices,setCommunityPrices] = useState([]);
  const [loading,setLoading] = useState(false);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const [isOnline,setIsOnline] = useState(false)


  

 
  useEffect(() => {
    const loadLocalData = async () => {
        try {
            const localData = await communityRates.loadJsonFromFile();
            if (localData) {
                setCommunityPrices(localData.data);
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
                setLoading(true);
                const timeout = new Promise((_,reject)=> setTimeout(() => reject(new Error('network Timed out')),10000))
                const syncOperation = await communityRates.fetchAndSync();
                await Promise.race([syncOperation,timeout])

                const localData = await communityRates.loadJsonFromFile();
                if (localData) {
                    setCommunityPrices(localData.data);
                } else {
                    console.log("No local data available after sync.");
                }
            } catch (error) {
                console.error("Error syncing data:", error);
            } finally {
                setLoading(false);
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


  

  
  const handleShowPrices = (community) => {
    setSelectedCommunity(community);
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand(); // Expands the BottomSheet
  };
  
  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false);
    bottomSheetRef.current?.close(); // Closes the BottomSheet
  };

  const renderMarketPrices = () => (
    <View style={styles.bottomSheetContent}>
      <TouchableOpacity onPress={handleCloseBottomSheet} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Prices in {selectedCommunity?.location}</Text>
      <ScrollView>
      {selectedCommunity?.commodities.map((item) => (
        <View key={item.name} style={styles.marketItem}>
          <Image source={{uri:item.icon}} style={styles.marketImage} />
          <View style={{width: 150}}>
            <Text style={styles.marketItemText}>{item.name}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text style={styles.marketItemPrice}>High</Text>
              <View
                style={{
                  width: wp('12'),
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
                  width: wp('12'),
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
      {loading ? (
        <ActivityIndicator size="large" color="green" style={styles.loader} />
      ) : (
        <FlatList
          data={communityPrices}
          renderItem={({ item }) => (
            <CommunityPricesCard
              location={item.location}
              date={item.date}
              onShowPrices={() => handleShowPrices(item)} // Pass entire community object
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => setIsBottomSheetOpen(false)}
        backgroundStyle={styles.bottomSheetBackground}
      >
        {renderMarketPrices()}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContent: {
    padding: 20,
    marginBottom:50
  },
  bottomSheetBackground: {
    backgroundColor: "#221D1D",
  },
  marketImage: {
    width: 40,
    height: 40,
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
  marketItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
    color: "white",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },
  lastUpdated: {
    color: "#94E081",
    fontSize: 16,
  },
  descriptionText: {
    color: "#94E081",
    fontSize: 16,
    flex : 1,
    flexWrap: 'wrap',
    textAlignVertical:'top'
  },
  priceContainer: {
    alignItems: "center",
  },
  priceChange: {
    width: 35,
    height: 25,
    backgroundColor: "#ECC63E",
    borderRadius: 5,
    padding: 2,
  },
  priceChangeText: {
    color: "white",
  },
});
