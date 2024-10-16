import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SplashScreen from "./src/screens/SplashScreen";

import { AuthContext } from "./AuthContext";
import Sidebar from "./src/widgets/Sidebar"; // Import the Sidebar component

import Registration from "./src/screens/Auth/Registration";
import SignIn from "./src/screens/Auth/SignIn";

import SuccessScreen from "./src/screens/SuccessScreen";
import CompleteScreen from "./src/screens/CompleteScreen";
import MyAggregatesScreen from "./src/screens/Aggregator/MyAggregatesScreen";
import ManageFarmersScreen from "./src/screens/Farmer/ManageFarmersScreen";
import AddFarmerScreen from "./src/screens/Farmer/AddFarmerScreen";
import AddFarmerScreen2 from "./src/screens/Farmer/AddFarmerScreen2";
import AddFarmerScreen3 from "./src/screens/Farmer/AddFarmerScreen3";
import AggregationDetailScreen from "./src/screens/Aggregator/AggregationDetailScreen";
import NotificationScreen from "./src/screens/Notification/NotificationScreen";
import NotificationDetailScreen from "./src/screens/Notification/NotificationDetailScreen";
import ForgotPassword from "./src/screens/Auth/ForgotPassword";
import OTPScreen from "./src/screens/Auth/OTPScreen";
import ResetPassword from "./src/screens/Auth/ResetPassword";
import CommunityPricesScreen from "./src/screens/Community/CommunityPricesScreen";
import SellToTDXScreen from "./src/screens/Commodity/SellToTDXScreen";
import FarmerDetailScreen from "./src/screens/Farmer/FarmerDetailScreen";
import QualityControlScreen from "./src/screens/Commodity/QualityControlScreen";
import FarmerPaymentScreen from "./src/screens/Farmer/FarmerPaymentScreen";
import CommodityAggregatesCard from "./src/_components/CommodityAggregatesCard";
import AggregatorProfileScreen from "./src/screens/Aggregator/AggregatorProfileScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AggregatorQuantitiesScreen from "./src/screens/Aggregator/AggregatorQuantitiesScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const { state } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {state.isLoading ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : state.userToken === null ? (
          <>
            <Stack.Screen
              name="Registration"
              component={Registration}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="OTPScreen"
              component={OTPScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{ headerShown: true }}
            />

            <Stack.Screen
              name="SuccessScreen"
              component={SuccessScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
             <Stack.Screen
              name="DashboardScreen"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SellToTDXScreen"
              component={SellToTDXScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FarmerDetailScreen"
              component={FarmerDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="QualityControlScreen"
              component={QualityControlScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FarmerPaymenetScreen"
              component={FarmerPaymentScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CommodityAggregatesCard"
              component={CommodityAggregatesCard}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CommunityPricesScreen"
              component={CommunityPricesScreen}
              options={{ title: "Community Prices" }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="CompleteScreen"
              component={CompleteScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen name="AddFarmerScreen" component={AddFarmerScreen} />

            <Stack.Screen
              name="AggregationDetailScreen"
              component={AggregationDetailScreen}
            />
            <Stack.Screen
              name="AggregatorQuantitiesScreen"
              component={AggregatorQuantitiesScreen}
            />
            <Stack.Screen
              name="AggregatorProfileScreen"
              component={AggregatorProfileScreen}
            />
            <Stack.Screen
              name="NotificationDetailScreen"
              component={NotificationDetailScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar {...props} />}>
      <Drawer.Screen name="DashboardScreen" component={DashboardScreen} />
      <Drawer.Screen name="SellToTDXScreen" component={SellToTDXScreen} />
      <Drawer.Screen name="FarmerDetailScreen" component={FarmerDetailScreen} />
      <Drawer.Screen
        name="QualityControlScreen"
        component={QualityControlScreen}
      />
      <Drawer.Screen
        name="FarmerPaymentScreen"
        component={FarmerPaymentScreen}
      />
      <Drawer.Screen
        name="CommunityPricesScreen"
        component={CommunityPricesScreen}
      />
      <Drawer.Screen name="AddFarmerScreen" component={AddFarmerScreen} />

      <Drawer.Screen name="AddFarmerScreen2" component={AddFarmerScreen2} />

      <Drawer.Screen name="AddFarmerScreen3" component={AddFarmerScreen3} />

      <Drawer.Screen name="MyAggregatesScreen" component={MyAggregatesScreen} />
      <Drawer.Screen
        name="ManageFarmersScreen"
        component={ManageFarmersScreen}
      />

      <Drawer.Screen name="NotificationScreen" component={NotificationScreen} />
      <Drawer.Screen
        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
      />
      <Drawer.Screen
        name="AggregationDetailScreen"
        component={AggregationDetailScreen}
      />
      <Drawer.Screen
        name="AggregatorProfileScreen"
        component={AggregatorProfileScreen}
      />
      <Drawer.Screen
        name="AggregatorQuantitiesScreen"
        component={AggregatorQuantitiesScreen}
      />
      <Drawer.Screen name="CompleteScreen" component={CompleteScreen} />
    </Drawer.Navigator>
  );
}
