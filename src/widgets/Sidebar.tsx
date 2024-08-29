import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ImageBackground } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';
import AuthContext from '../../AuthContext';
import AuthTokenStore from '../../AuthTokenStore';
import AggregatorController from '../controllers/api/AggregatorController';

const Sidebar = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  const [aggregator, setAggregator] = useState(null);
  const [proFirstName, setProFirstName] = useState("");
  const [proLastName, setProLastName] = useState("");
  const [proAccountType, setProAccountType] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchAggregatorProfile();
  }, []);

  const fetchAggregatorProfile = async () => {
    try {
      const aggregator_id = await AuthTokenStore.getUserID();
      const response = await AggregatorController.show(aggregator_id);
      if (response && response.data) {
        setAggregator(response.data);
        setProFirstName(response.data.first_name);
        setProLastName(response.data.last_name);
        setProAccountType(response.data.utype);
      }
    } catch (error) {
      console.error('Error fetching aggregator profile:', error);
    }
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    signOut();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleClose = () => {
    navigation.closeDrawer();
  };

  // Array of menu items
  const menuItems = [
    { name: 'Sell To TDX', icon: 'arrow-right', onPress: () => navigation.navigate('SellToTDXScreen') },
    { name: 'My aggregates', icon: 'chart-bar', onPress: () => navigation.navigate('MyAggregatesScreen') },
    { name: 'Farmers', icon: 'user-alt', onPress: () => navigation.navigate('ManageFarmersScreen') },
    { name: 'Community Prices', icon: 'wallet', onPress: () => navigation.navigate('DashboardScreen') },
    { name: 'Notifications', icon: 'cog', onPress: () => navigation.navigate('NotificationScreen') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Close</Text>
          <View style={{ marginTop: 3 }}>
            <Ionicons name="close" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}> 
          <Text style={{color:'white'}} > <FontAwesome5 name="user" color='white'/> | Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Map over the menuItems array */}
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name={item.icon} size={20} color="green" />
                </View>
                <Text style={styles.menuItemText}>{item.name}</Text>
                <FontAwesome5 name="chevron-right" color="white" style={styles.chevronIcon} />
              </View>
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSignOut} style={styles.profileBtn}>
          <FontAwesome5 name="power-off" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 10 }}>Log Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.imageBackgroundContainer}>
        <ImageBackground
          source={require('../../assets/cultivating.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to log out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
                onPress={confirmLogout}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#f44336' }]}
                onPress={cancelLogout}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21893E',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  profileBtn: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#C1FFA03B',
    fontSize: 5,
    paddingRight: 20,
    paddingLeft: 20,
  },
  divider: {
    marginVertical: 15,
  },
  menuItems: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8DC73F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,

  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#eee',
  
  },
  chevronIcon: {
    alignSelf: 'flex-end',
    marginBottom:10
  },
  imageBackgroundContainer: {
    width: '100%',
    height: 180,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33, 137, 62, 0.6)',
  },
  footer: {
    width: '55%',
    marginBottom: 5,
    paddingLeft: 15,
    paddingRight: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    gap: 6,
  },
  profileContainer: {},
});

export default Sidebar;
