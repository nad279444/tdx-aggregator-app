import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommunityPricesCard from '../../_components/CommunityPricesCard';
import BottomSheet from "@gorhom/bottom-sheet";

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
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const communityData = [
    {
      id: 1,
      location: 'Dormu',
      date: '2/8/24',
      commodities: [
        { name: "Maize", icon: require("../../../assets/Maize.jpg"), price: 20, description: 'High demand this season' },
        { name: "Soybean", icon: require("../../../assets/Soybean.jpg"), price: 60, description: 'Increased export rates' },
      ],
    },
    {
      id: 2,
      location: 'Kumasi',
      date: '3/8/24',
      commodities: [
        { name: "Sesame Seeds", icon: require("../../../assets/SesemeSeeds.jpg"), price: 70, description: 'Good quality, high yield' },
      ],
    },
    {
      id: 3,
      location: 'Accra',
      date: '4/8/24',
      commodities: [
        { name: "GroundNut", icon: require("../../../assets/GroundNut.jpg"), price: 80, description: 'Stable market prices' },
      ],
    },
    {
      id: 4,
      location: 'Tamale',
      date: '5/8/24',
      commodities: [
        { name: "Rice", icon: require("../../../assets/Soybean.jpg"), price: 100, description: 'Increased local production' },
      ],
    },
    {
      id: 5,
      location: 'Ho',
      date: '6/8/24',
      commodities: [
        { name: "Cassava", icon: require("../../../assets/SesemeSeeds.jpg"), price: 50, description: 'Lower harvest this year' },
      ],
    },
  ];

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
    <ScrollView contentContainerStyle={styles.bottomSheetContent}>
      <TouchableOpacity onPress={handleCloseBottomSheet} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Prices in {selectedCommunity?.location}</Text>
      {selectedCommunity?.commodities.map((item) => (
        <View key={item.name} style={styles.marketItem}>
          <Image source={item.icon} style={styles.marketImage} />
          <View style={{width: 150}}>
            <Text style={styles.marketItemText}>{item.name}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.marketItemPrice}>{item.price}₵/KG</Text>
            <View style={styles.priceChange}>
              <Text style={styles.priceChangeText}>+4₵</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={communityData}
        renderItem={({ item }) => (
          <CommunityPricesCard
            location={item.location}
            date={item.date}
            onShowPrices={() => handleShowPrices(item)} // Pass entire community object
          />
        )}
        keyExtractor={item => item.id.toString()}
      />

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
  bottomSheetContent: {
    padding: 20,
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
