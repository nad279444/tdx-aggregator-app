import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import SignInScreen from './src/screens/Auth/SignInScreen';
import StartScreen from './src/screens/StartScreen';

import EditAggregatorProfileScreen from './src/screens/Aggregator/EditAggregatorProfileScreen';
import AggregatorProfileScreen  from './src/screens/Aggregator/AggregatorProfileScreen';

import AuthContext from './AuthContext';
import Sidebar from './src/widgets/Sidebar'; // Import the Sidebar component
import AuthPage from './src/screens/Auth/AuthPage';
import RegisterPage from './src/screens/Auth/RegisterPage';
import ForgotPasswordPage from './src/screens/Auth/ForgotPasswordPage';
import ResetPasswordPage from './src/screens/Auth/ResetPasswordPage';
import SuccessScreen from './src/screens/SuccessScreen';
import AssignmentDetailScreen from './src/screens/Assignment/AssignmentDetailScreen';
import OnBoardingScreen from './src/screens/Onboarding/OnBoardingScreen';
import FarmerSelectionScreen from './src/screens/Farmer/FarmerSelectionScreen';
import FarmersCommodityAssignmentScreen from './src/screens/Farmer/FarmersCommodityAssignmentScreen';
import CompleteScreen from './src/screens/CompleteScreen';
import FarmerAssignmentScreen from './src/screens/Farmer/FarmerAssignmentScreen';
import ManageFarmersScreen from './src/screens/Farmer/ManageFarmersScreen';
import AddFarmerScreen from './src/screens/Farmer/AddFarmerScreen';
import FarmerProfileScreen from './src/screens/Farmer/FarmerProfileScreen';
import EditFarmerProfileScreen from './src/screens/Farmer/EditFarmerProfileScreen';
import AggregationDetailScreen from './src/screens/Aggregator/AggregationDetailScreen';
import AddCommodityScreen from './src/screens/Commodity/AddCommodityScreen';
import ManageCommodityScreen from './src/screens/Commodity/ManageCommodityScreen';
import CommodityDetailScreen from './src/screens/Commodity/CommodityDetailScreen';
import NotificationScreen from './src/screens/Notification/NotificationScreen';
import NotificationDetailScreen from './src/screens/Notification/NotificationDetailScreen';
import VerifyEmailPage from './src/screens/Auth/VerifyEmailPage';
import SellToTDXScreen from './src/screens/Commodity/SellToTDXScreen';
import CommodityDisplayScreen from './src/screens/Commodity/CommodityDisplayScreen';
import PriceTableScreen from './src/screens/Community/PriceTableScreen';
import DashboardScreen from './src/screens/Aggregator/DashboardScreen';
import FarmerDetailScreen from './src/screens/Farmer/FarmerDetailScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const { state } = useContext(AuthContext);

  return(
    <NavigationContainer>
      
      <Stack.Navigator>
        {state.isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        ) : state.userToken === null ? (
          <>
            <Stack.Screen name="AuthPage" component={AuthPage} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
            <Stack.Screen name="OnBoardingScreen"  component={OnBoardingScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} options={{ headerShown: false }} />
            <Stack.Screen name="VerifyEmailPage" component={VerifyEmailPage} options={{ headerShown: false }} />
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
          
          <Stack.Screen name="SellToTDXScreen" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="FarmerDetailScreen" component={FarmerDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CommodityDisplayScreen" component={CommodityDisplayScreen} options={{ title: 'Commodity' }} />
          <Stack.Screen name="PriceTableScreen" component={PriceTableScreen} options={{ title: 'Community Prices' }} />
          <Stack.Screen name="HomeScreen" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AssignmentDetailScreen" component={AssignmentDetailScreen }  />
          <Stack.Screen name="FarmerSelectionScreen" component={FarmerSelectionScreen}  />
          <Stack.Screen name="CalculationScreen" component={FarmersCommodityAssignmentScreen} />
          <Stack.Screen name="CompleteScreen" component={CompleteScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AddFarmerScreen" component={AddFarmerScreen}  />
          <Stack.Screen name="FarmerProfileScreen" component={FarmerProfileScreen}  />
          <Stack.Screen name="EditFarmerProfileScreen" component={EditFarmerProfileScreen}  />
          <Stack.Screen name="AggregationDetailScreen" component={AggregationDetailScreen}  />
          <Stack.Screen name="NotificationDetailScreen" component={NotificationDetailScreen}  />
        </>  
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />} >
      
      <Drawer.Screen name="SellToTDXScreen" component={SellToTDXScreen}  />
      <Stack.Screen name="FarmerDetailScreen" component={FarmerDetailScreen} />
      <Drawer.Screen name="StarScreen" component={StartScreen} />
      <Drawer.Screen name="Profile" component={AggregatorProfileScreen}  />
      <Drawer.Screen name="EditProfile" component={EditAggregatorProfileScreen}  />
      <Drawer.Screen name="AssignmentDetailScreen" component={AssignmentDetailScreen }  />
      <Stack.Screen name="FarmerAssignmentscreen" component={FarmerAssignmentScreen}  />
      <Stack.Screen name="ManageFarmersScreen" component={ManageFarmersScreen}  />
      <Stack.Screen name="ManageCommodityScreen" component={ManageCommodityScreen}  />
      <Stack.Screen name="AddCommodityScreen" component={AddCommodityScreen}  />
      <Stack.Screen name="CommodityDetailScreen" component={CommodityDetailScreen}  />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen}  />
    </Drawer.Navigator>
  );
}