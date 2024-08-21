// import React, { useState, useEffect } from 'react';
// import { View, Text, RefreshControl, StyleSheet, ScrollView, TextInput, FlatList, TouchableOpacity } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons';
// import { ProgressBar } from 'react-native-paper';
// import { Avatar, Button } from 'react-native-elements';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import FarmerController from '../../controllers/api/FarmerContoller';
// import AuthTokenStore from '../../../AuthTokenStore';

// const ManageFarmersScreen = ({ route, navigation }) => {
//   const [farmers, setFarmers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredFarmers, setFilteredFarmers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchFarmers = async () => {
//     try {
//       setLoading(true);
//       const userID = await AuthTokenStore.getUserID();
//       const data = await FarmerController.specify(page,userID);
      
//       console.log(data);
      
//       if (data) {
//         if (page === 1) {
//           setFarmers(data.data.data);
//           setFilteredFarmers(data.data.data);
//         } else {
//           setFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
//           setFilteredFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
//         }
//         setHasMore(data.data.next_page_url !== null);
//       } else {
//         console.error('Error fetching farmers: No data received');
//       }
//     } catch (error) {
//       console.error('Error fetching farmers:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

 
//   useFocusEffect(
//     React.useCallback(() => {
//       navigation.setOptions({ title: 'Manage Farmers' });
//       fetchFarmers(); // Call your function to fetch data
//     }, [page])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//     fetchFarmers();
//     setRefreshing(false);
//   };

//   const handleSearch = (text) => {
//     setSearchQuery(text);
//     const filteredData = farmers.filter((farmer) =>
//       farmer.first_name.toLowerCase().includes(text.toLowerCase()) ||
//       farmer.last_name.toLowerCase().includes(text.toLowerCase())
//     );
//     setFilteredFarmers(filteredData);
//   };

//   const handleFarmerSelect = (farmer) => {
//     navigation.navigate('FarmerProfileScreen', { farmerData: farmer });
//   };

//   const handleAddFarmer = () => {
//     navigation.navigate('AddFarmerScreen');
//   };

//   const renderAvatar = (item) => {
//     if (item.profile_photo_path) {
//       return <Avatar rounded source={{ uri: item.profile_photo_path }} size="medium" containerStyle={styles.avatar} />;
//     } else {
//       const initials = `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`;
//       return (
//         <Avatar
//           rounded
//           title={initials}
//           size="medium"
//           containerStyle={[styles.avatar, { backgroundColor: 'green' }]}
//           titleStyle={{ color: 'white', fontSize: 20, textTransform: "uppercase" }}
//         />
//       );
//     }
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleFarmerSelect(item)}>
//       <View style={styles.notificationContent}>
//         <View style={styles.leftContent}>
//           {renderAvatar(item)}
//           <View style={styles.textContainer}>
//             <Text style={styles.notificationText}>{item.first_name} {item.last_name}</Text>
//             <Text style={styles.farmerInfo}>Ranking: {item.ranking} 4.5 </Text>
//             <Text style={styles.farmerInfo}>Verification: {item.verification_status}</Text>
//           </View>
//         </View>
//         <View style={styles.rightContent}>
//           <TouchableOpacity style={styles.selectButton} onPress={() => handleFarmerSelect(item)} >
//             <Text style={{ color: "green" }}> Details  </Text>
//           </TouchableOpacity>
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
//         placeholder="Search for farmer..."
//         placeholderTextColor="gray"
//       />
//       <FlatList
//         data={filteredFarmers}
//         keyExtractor={(item, index) => item.id.toString() + index.toString()} // Ensure unique keys
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
//       <TouchableOpacity
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
//         }} onPress={handleAddFarmer}
//       >
//         <Text style={{ color: "#fff" }}> + Add Farmer </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingBottom: 10,
//     paddingTop: 0,
//   },
//   notificationContent: {
//     paddingVertical: 15,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   leftContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rightContent: {
//     alignItems: 'flex-end',
//   },
//   avatar: {
//     marginRight: 10,
//   },
//   textContainer: {
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },
//   notificationText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textTransform: "capitalize"
//   },
//   farmerInfo: {
//     fontSize: 14,
//     color: 'gray',

//   },
//   selectButton: {
//     backgroundColor: '#eff',
//     color: "green",
//     paddingHorizontal: 20,
//     paddingVertical: 5,
//     borderRadius: 30,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default ManageFarmersScreen;










import React, { useState, useEffect } from 'react';
import { View, Text, RefreshControl, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import FarmerController from '../../controllers/api/FarmerContoller';
import AuthTokenStore from '../../../AuthTokenStore';

const ManageFarmersScreen = ({ route, navigation }) => {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const userID = await AuthTokenStore.getUserID();
      const data = await FarmerController.specify(page, userID);
      
      if (data) {
        if (page === 1) {
          setFarmers(data.data.data);
          setFilteredFarmers(data.data.data);
        } else {
          setFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
          setFilteredFarmers(prevFarmers => [...prevFarmers, ...data.data.data]);
        }
        setHasMore(data.data.next_page_url !== null);
      } else {
        console.error('Error fetching farmers: No data received');
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({ title: 'Manage Farmers' });
      fetchFarmers();
    }, [page])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchFarmers();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredData = farmers.filter((farmer) =>
      farmer.first_name.toLowerCase().includes(text.toLowerCase()) ||
      farmer.last_name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFarmers(filteredData);
  };

  const handleFarmerSelect = (farmer) => {
    navigation.navigate('FarmerProfileScreen', { farmerData: farmer });
  };

  const handleAddFarmer = () => {
    navigation.navigate('AddFarmerScreen');
  };

  const renderAvatar = (item) => {
    if (item.profile_photo_path) {
      return <Avatar rounded source={{ uri: item.profile_photo_path }} size="medium" containerStyle={styles.avatar} />;
    } else {
      const initials = `${item.first_name.charAt(0)}${item.last_name.charAt(0)}`;
      return (
        <Avatar
          rounded
          title={initials}
          size="medium"
          containerStyle={[styles.avatar, { backgroundColor: 'green' }]}
          titleStyle={{ color: 'white', fontSize: 20, textTransform: "uppercase" }}
        />
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleFarmerSelect(item)}>
      <View style={styles.notificationContent}>
        <View style={styles.leftContent}>
          {renderAvatar(item)}
          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.farmerInfo}>Ranking: {item.ranking} 4.5 </Text>
            <Text style={styles.farmerInfo}>Verification: {item.verification_status}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity style={styles.selectButton} onPress={() => handleFarmerSelect(item)} >
            <Text style={{ color: "green" }}> Details  </Text>
          </TouchableOpacity>
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
        placeholder="Search for farmer..."
        placeholderTextColor="gray"
      />
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
      ) : (
        <>
          {filteredFarmers.length === 0 ? (
            <Text style={styles.noItemsText}>No farmers available</Text>
          ) : (
            <FlatList
              data={filteredFarmers}
              keyExtractor={(item, index) => item.id.toString() + index.toString()} // Ensure unique keys
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
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddFarmer}
      >
        <Text style={styles.addButtonText}> + Add Farmer </Text>
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
  notificationContent: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  avatar: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: "capitalize"
  },
  farmerInfo: {
    fontSize: 14,
    color: 'gray',
  },
  selectButton: {
    backgroundColor: '#eff',
    color: "green",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 30,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
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
    color: "#fff",
  },
});

export default ManageFarmersScreen;
