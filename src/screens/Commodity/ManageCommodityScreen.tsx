// import React, { useState, useEffect } from 'react';
// import { View, Text, RefreshControl, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity } from 'react-native';
// import CommodityController from '../../controllers/api/CommodityController';
// import { useFocusEffect } from '@react-navigation/native';
// import { Avatar } from 'react-native-elements';
// import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5
// const ManageCommodityScreen = ({ navigation }) => {
//   const [commodities, setCommodities] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredCommodities, setFilteredCommodities] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchCommodities = async () => { // Change fetchFarmers to fetchCommodities
//     try {
//       setLoading(true);
//       const data = await CommodityController.index(page); // Assuming FarmerController handles commodity data too
//       if (data) {
//         if (page === 1) {
//           setCommodities(data.data.data);
//           setFilteredCommodities(data.data.data);
//         } else {
//           setCommodities(prevCommodities => [...prevCommodities, ...data.data.data]);
//           setFilteredCommodities(prevCommodities => [...prevCommodities, ...data.data.data]);
//         }
//         setHasMore(data.data.next_page_url !== null);
//       } else {
//         console.error('Error fetching commodities: No data received');
//       }
//     } catch (error) {
//       console.error('Error fetching commodities:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchCommodities();
//     }, [page])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//     fetchCommodities();
//     setRefreshing(false);
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     const filteredData = commodities.filter((commodity) =>
//       commodity.name.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredCommodities(filteredData);
//   };

//   const handleCommoditySelect = (commodity) => {
//     navigation.navigate('CommodityDetailScreen', { commodityData: commodity });
//   };

//   const handleAddCommodity = () => {
//     navigation.navigate('AddCommodityScreen');
//   };

//   const renderIconOrImage = (item) => {
//     if (item.commodity_image) {
//       return <Avatar rounded source={{ uri: item.commodity_image }} size="medium" containerStyle={styles.avatar} />;
//     } else {
//       return <FontAwesome5 name="boxes" size={24} color="green" />;
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleCommoditySelect(item)}>
//       <View style={styles.commodityItem}>
//         {renderIconOrImage(item)}
//         <View>
//           <Text style={styles.commodityName}>{item.name}</Text>
//           <Text>Price: {item.price}</Text>
//           <Text>Quantity: {item.quantity}</Text>
//           <Text>Price Per Kg: {item.price_per_kg}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchInput}
//         onChangeText={handleSearch}
//         value={searchQuery}
//         placeholder="Search for commodity..."
//         placeholderTextColor="gray"
//       />
//       <FlatList
//         data={filteredCommodities}
//         keyExtractor={(item) => item.id.toString()} // Ensure unique keys
//         renderItem={renderItem}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//         onEndReached={() => {
//           if (!loading && hasMore) {
//             setPage(page + 1);
//           }
//         }}
//         onEndReachedThreshold={0.1}
//       />

//         <TouchableOpacity
//         style={{
//           borderWidth: 1,
//           borderColor: 'rgba(0,0,0,0.2)',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: 140,
//           position: 'absolute',
//           bottom: 40,
//           right: 10,
//           height: 40,
//           backgroundColor: '#000',
//           borderRadius: 100,
//         }} onPress={handleAddCommodity}
//       >
//         <Text style={{ color: "#fff" }}> + Add New </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         paddingHorizontal: 10,
//         paddingBottom: 10,
//         paddingTop: 0,
//       },
//     commodityItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//       },
//       commodityName: {
//         marginLeft: 10,
//         fontSize: 16,
//         fontWeight: 'bold',
//       },
//       searchInput: {
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         marginTop: 10,
//         marginBottom: 10,
//         paddingHorizontal: 10,
//       },

//     avatar: {
//       marginRight: 10,
//     },
  
// });

// export default ManageCommodityScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import CommodityController from '../../controllers/api/CommodityController';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5

const ManageCommodityScreen = ({ navigation }) => {
  const [commodities, setCommodities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCommodities, setFilteredCommodities] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchCommodities = async () => {
    try {
      setLoading(true);
      const data = await CommodityController.index(page);
      if (data) {
        if (page === 1) {
          setCommodities(data.data.data);
          setFilteredCommodities(data.data.data);
        } else {
          setCommodities(prevCommodities => [...prevCommodities, ...data.data.data]);
          setFilteredCommodities(prevCommodities => [...prevCommodities, ...data.data.data]);
        }
        setHasMore(data.data.next_page_url !== null);
      } else {
        console.error('Error fetching commodities: No data received');
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCommodities();
    }, [page])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchCommodities();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = commodities.filter((commodity) =>
      commodity.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCommodities(filteredData);
  };

  const handleCommoditySelect = (commodity) => {
    navigation.navigate('CommodityDetailScreen', { commodityData: commodity });
  };

  const handleAddCommodity = () => {
    navigation.navigate('AddCommodityScreen');
  };

  const renderIconOrImage = (item) => {
    if (item.commodity_image) {
      return <Avatar rounded source={{ uri: item.commodity_image }} size="medium" containerStyle={styles.avatar} />;
    } else {
      return (
        <View style={styles.boxesIcon}>
          <FontAwesome5 name="boxes" size={24} color="green" />
        </View>
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCommoditySelect(item)}>
      <View style={styles.commodityItem}>
        {renderIconOrImage(item)}
        <View>
          <Text style={styles.commodityName}>{item.name}</Text>
          <Text>Price Per Bag: {item.price}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Price Per Kg: {item.price_per_kg}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search for commodity..."
        placeholderTextColor="gray"
      />
      <FlatList
        data={filteredCommodities}
        keyExtractor={(item) => item.id.toString()} // Ensure unique keys
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        onEndReached={() => {
          if (!loading && hasMore) {
            setPage(page + 1);
          }
        }}
        onEndReachedThreshold={0.1}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddCommodity}
      >
        <Text style={styles.addButtonText}>+ Add New</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 0,
  },
  commodityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commodityName: {
    // marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  avatar: {
    marginRight: 10,
  },
  boxesIcon: {
    backgroundColor: '#eff',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding:10,

  },
  addButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    position: 'absolute',
    bottom: 40,
    right: 10,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 100,
  },
  addButtonText: {
    color: '#fff',
  },
});

export default ManageCommodityScreen;