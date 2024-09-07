// import React, { useContext, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
// import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for icons
// import AuthContext from '../../AuthContext';
// import AggregatorAssignmentController from '../controllers/api/AggregtorAssignmentController';
// import AuthTokenStore from '../../AuthTokenStore';
// import { StyleProp } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';

// const StartScreen = ({ navigation }) => {
//   const { signOut } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState('index');
//   const [assignments, setAssignments] = useState([]);

//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [hasMore, setHasMore] = useState(true);


//   const handleSignOut = () => {
//     signOut();
//   };

//   // useEffect(() => {
//   //   navigation.setOptions({ title: 'Order Page' });
//   //   fetchAssignments();
//   // }, [activeTab]); // Fetch assignments whenever activeTab changes


//   useFocusEffect(
//     React.useCallback(() => {
//       fetchAssignments(); // Call your function to fetch data
//     }, [activeTab])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     setPage(1);
//     fetchAssignments();
//     setRefreshing(false);
//   };


//   const fetchAssignments = async () => {
//     try {
//       let assignmentsData;
//       if (activeTab === 'index') {
//         assignmentsData = await AggregatorAssignmentController.index();
//       } else if (activeTab === 'specific'){
//         // You might need to pass userId here if required
//         let user_id = await AuthTokenStore.getUserID();
//         assignmentsData = await AggregatorAssignmentController.specific(user_id);
//       }
//       if (assignmentsData) {
//         setAssignments(assignmentsData.data.data);
//       } else {
//         setAssignments([]);
//       }
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//     }
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   const handleAssignmentPress = (assignment_id,assignment_assigned_date,assignment_expected_fulfillment_date,completionPercentage,currentDate,daysLeft) => {
//     navigation.navigate('AssignmentDetailScreen', { assignment_id,assignment_assigned_date,assignment_expected_fulfillment_date,completionPercentage,currentDate,daysLeft });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity onPress={() => handleTabChange('index')} style={[styles.tabButton, activeTab === 'index' && styles.activeTab as StyleProp<ViewStyle>]}>
//           <Text style={[styles.tabText, activeTab === 'index' && styles.activeTabText as StyleProp<TextStyle>]}> 
//           <FontAwesome5 name="bell" size={18} color={activeTab === 'index' ? '#fff' : 'black'} /> General Order </Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => handleTabChange('specific')} style={[styles.tabButton, activeTab === 'specific' && styles.activeTab as StyleProp<ViewStyle>]}>
//           <Text style={[styles.tabText, activeTab === 'specific' && styles.activeTabText as StyleProp<TextStyle>]}>
//           <FontAwesome5 name="user"  size={18} color={activeTab === 'specific' ? '#fff' : 'black'} /> 
//              Specific Orders </Text>
//         </TouchableOpacity>
//       </View>
//       {assignments.map((assignment, index) => (
//         <NotificationCard key={index} assignment={assignment} handleAssignmentPress={handleAssignmentPress} />
//       ))}
//     </View>
//   );
// };

// const NotificationCard = ({ assignment, handleAssignmentPress }) => {
//   const currentDate = new Date().getTime();
//   const assignedDate = new Date(assignment.assigned_date).getTime();
//   const expectedFulfillmentDate = new Date(assignment.expected_fulfillment_date).getTime();
//   const totalDays = Math.ceil((expectedFulfillmentDate - assignedDate) / (1000 * 60 * 60 * 24));
//   const daysLeft = Math.ceil((expectedFulfillmentDate - currentDate) / (1000 * 60 * 60 * 24));
//   const completionPercentage = ((totalDays - daysLeft) / totalDays) * 100;

//   return (
//     <TouchableOpacity onPress={() => handleAssignmentPress(assignment.id,assignment.assigned_date,assignment.expected_fulfillment_date,completionPercentage,currentDate,daysLeft)} style={styles.notification}>
//       <FontAwesome5 name="bell" size={33} color="green" />
//       <View style={styles.notificationContent}>
//         <Text style={styles.notificationText}>New Order: REF# {assignment.id}</Text>
//         <Text style={styles.notificationDate}>Assigned: {assignment.assigned_date}</Text>
//         <Text style={styles.notificationDate}>Expected Fulfillment: {assignment.expected_fulfillment_date}</Text>
//         <Text style={styles.daysLeft}>Days Left: {daysLeft}</Text>
//         <View style={styles.progressBarContainer}>
//           <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
//         </View>
//         <View style={styles.progressTextContainer}>
//         <Text style={styles.progressText}>Today: {currentDate} </Text>
//         <Text style={styles.progressText}>Days Left: {daysLeft}</Text>
//       </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#f0f0f0',
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 16,
//     color: 'blue',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     alignItems: 'center',
//     backgroundColor:"#fff",
//   },
//   tabButton: {
//     flexDirection: 'row',
//     marginRight: 20,
//     alignItems: 'center',
//   },
//   tabText: {
//     fontSize: 18,
//     color: 'black',
//     marginLeft: 5,
//     padding:5,
//   },
//   activeTab: {
//     color: 'blue',
//   },
//   activeTabText: {
//     fontWeight: 'bold',
//     backgroundColor:"green",
//     borderRadius:5,
//     color:"#fff",
//   },
//   heading: {
//     fontSize: 24,
//     marginBottom: 10,
//   },
//   notification: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: 'green',
//     borderWidth: 1,
//   },
//   notificationContent: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   notificationText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   notificationDate: {
//     fontSize: 14,
//     color: 'gray',
//   },
//   daysLeft: {
//     fontSize: 14,
//     color: 'blue',
//     marginBottom: 5,
//   },
//   progressBarContainer: {
//     height: 10,
//     backgroundColor: '#ccc',
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: 'green',
//     borderRadius: 5,
//   },
//   progressTextContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 5,
//   },
//   progressText: {
//     fontSize: 12,
//     color: 'gray',
//   },
// });

// export default StartScreen;




import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ViewStyle, StyleProp } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AuthContext from '../../AuthContext';
import AggregatorAssignmentController from '../controllers/api/AggregtorAssignmentController';
import AuthTokenStore from '../../AuthTokenStore';
import { useFocusEffect } from '@react-navigation/native';

const StartScreen = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('index');
  const [assignments, setAssignments] = useState([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: 'Available Offers' });
    fetchAssignments();
  }, [activeTab, page]);

  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
    }, [activeTab])
  );

  const fetchAssignments = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let assignmentsData;
      if (activeTab === 'index') {
        assignmentsData = await AggregatorAssignmentController.index(page);
      } else if (activeTab === 'specific'){
        let user_id = await AuthTokenStore.getUserID();
        assignmentsData = await AggregatorAssignmentController.specific(user_id, page);
      }
      if (assignmentsData) {
        if (page === 1) {
          setAssignments(assignmentsData.data.data);
        } else {
          setAssignments(prevAssignments => [...prevAssignments, ...assignmentsData.data.data]);
        }
        setHasMore(!!assignmentsData.data.next_page_url);
      } else {
        setAssignments([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAssignmentPress = (assignment_id,assignment_assigned_date,assignment_expected_fulfillment_date,completionPercentage,currentDate,daysLeft) => {
    navigation.navigate('', { assignment_id,assignment_assigned_date,assignment_expected_fulfillment_date,completionPercentage,currentDate,daysLeft });
  };

  const renderAssignmentItem = ({ item }) => (
    <DataCard assignment={item} handleAssignmentPress={handleAssignmentPress} />
  );

  const keyExtractor = (item, index) => index.toString();

  const onEndReached = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  const onRefresh = () => {
    if (!loading) {
      setPage(1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabChange('index')} style={[styles.tabButton, activeTab === 'index' && styles.activeTab as StyleProp<ViewStyle>]}>
          <Text style={[styles.tabText, activeTab === 'index' && styles.activeTabText]}> 
            <FontAwesome5 name="bell" size={18} color={activeTab === 'index' ? '#fff' : 'black'} /> General Orders 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('specific')} style={[styles.tabButton, activeTab === 'specific' && styles.activeTab as StyleProp<ViewStyle>]}>
          <Text style={[styles.tabText, activeTab === 'specific' && styles.activeTabText]}>
            <FontAwesome5 name="user"  size={18} color={activeTab === 'specific' ? '#fff' : 'black'} /> My Orders 
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={assignments}
        renderItem={renderAssignmentItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const DataCard = ({ assignment, handleAssignmentPress }) => {
  const currentDate = new Date().getTime();
  // assigned_date
  const assignedDate = new Date(assignment.created_at).getTime();
  const expectedFulfillmentDate = new Date(assignment.expected_fulfillment_date).getTime();
  const totalDays = Math.ceil((expectedFulfillmentDate - assignedDate) / (1000 * 60 * 60 * 24));
  let daysLeft = Math.ceil((expectedFulfillmentDate - currentDate) / (1000 * 60 * 60 * 24));
  let completionPercentage = ((totalDays - daysLeft) / totalDays) * 100;

if(daysLeft<=0){
  daysLeft =0
  console.log("percemtage::",completionPercentage);
}
if(completionPercentage>=100){
  completionPercentage =100;
}

  const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return(
    <TouchableOpacity onPress={() => handleAssignmentPress(assignment.id,assignment.assigned_date,assignment.expected_fulfillment_date,completionPercentage,currentDate,daysLeft)} style={styles.notification}>
      <FontAwesome5 name="bell" size={33} color="green" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>Purchase Order #{assignment.id}</Text>
        <Text style={styles.notificationDate}>Assigned: {assignment.assigned_date}</Text>
        <Text style={styles.notificationDate}>Expected Fulfillment: {assignment.expected_fulfillment_date}</Text>
        <Text style={styles.daysLeft}>{daysLeft} Days left </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
        </View>
        <View style={styles.progressTextContainer}>
        <Text style={styles.progressText}>Today: {formattedDate} </Text>
        {/* <Text style={styles.progressText}>Days Left: {daysLeft}</Text> */}
      </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: 'blue',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor:"#fff",
  },
  tabButton: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    color: 'black',
    marginLeft: 5,
    padding:5,
  },
  activeTab: {
    color: 'blue',
  },
  activeTabText: {
    fontWeight: 'bold',
    backgroundColor:"green",
    borderRadius:5,
    color:"#fff",
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
  },
  notification: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  notificationContent: {
    marginLeft: 10,
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: 14,
    color: 'gray',
  },
  daysLeft: {
    fontSize: 14,
    color: 'blue',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default StartScreen;