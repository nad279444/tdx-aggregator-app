import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataProvider';
import AppNavigator from './AppNavigator';
import AuthTokenStore from './AuthTokenStore';
import PushTokenController from './src/controllers/push/PushTokenController';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  // console.log(expoPushToken);
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes herenj' },
    icon: 'https://platform.tdxapp.ai/assets/images/tdx-logo.png',
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  // alert(errorMessage);
  // console.log(errorMessage);
  // throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
    const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(pushTokenString);
      let resp = await registerDevicePushTokenOnTDXServer(pushTokenString)
      // console.log(resp);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

async function registerDevicePushTokenOnTDXServer(pushToken){
  let userID = await AuthTokenStore.getUserID();
  if(userID !==""){
  let data = await PushTokenController.store(userID,pushToken);
  return data;
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // return (
  //   <View
  //     style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}
  //   >
  //     <Text>Your Expo push token: {expoPushToken}</Text>
  //     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
  //       <Text>
  //         Title: {notification && notification.request.content.title}{' '}
  //       </Text>
  //       <Text>Body: {notification && notification.request.content.body}</Text>
  //       <Text>
  //         Data:{' '}
  //         {notification && JSON.stringify(notification.request.content.data)}
  //       </Text>
  //     </View>
  //     <Button
  //       title="Press to Send Notification"
  //       onPress={async () => {
  //         await sendPushNotification(expoPushToken);
  //       }}
  //     />
  //   </View>
  // );

  return (
    <GestureHandlerRootView>
       <AuthProvider>
        <DataProvider>
         <AppNavigator />
        </DataProvider>
     
    </AuthProvider>
    </GestureHandlerRootView>
   
  );

}








// import React from 'react';
// import { useState, useEffect } from 'react';
// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import { AuthProvider } from './AuthContext';
// import AppNavigator from './AppNavigator';
// import AuthTokenStore from './AuthTokenStore';
// import PushTokenController from './src/controllers/push/PushTokenController';
// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// // Initialize Firebase
// const firebaseConfig = {
//     // Your Firebase configuration object
//     // apiKey: "YOUR_API_KEY",
//     // authDomain: "YOUR_AUTH_DOMAIN",
//     // projectId: "YOUR_PROJECT_ID",
//     // storageBucket: "YOUR_STORAGE_BUCKET",
//     // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//     // appId: "YOUR_APP_ID"
//     apiKey: "AIzaSyCveFuALvNm4TfO_sL14_FVdrkOcktcq0M",
//     authDomain: "tdx-platform.firebaseapp.com",
//     projectId: "tdx-platform",
//     storageBucket: "tdx-platform.appspot.com",
//     messagingSenderId: "6439785512",
//     appId: "1:6439785512:android:f774b9d25740a23d1f511d"

// };

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// function handleRegistrationError(errorMessage: string) {
//   console.log(errorMessage);
//   throw new Error(errorMessage);
// }

// async function registerForPushNotificationsAsync(): Promise<string | null> {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       handleRegistrationError('Permission not granted to get push token for push notification!');
//       return null;
//     }
    
//     try {
//       const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//       if (!projectId) {
//         handleRegistrationError('Project ID not found');
//         return null;
//       }
      
//       // Get the token from FCM
//       const fcmToken = await getToken(messaging, {
//         vapidKey: 'YOUR_VAPID_KEY', // Optional, only for web apps
//       });
      
//       console.log('FCM Token:', fcmToken);
//       let resp = await registerDevicePushTokenOnTDXServer(fcmToken);
//       console.log('Server response:', resp);
//       return fcmToken;
//     } catch (e: unknown) {
//       handleRegistrationError(`${e}`);
//       return null;
//     }
//   } else {
//     handleRegistrationError('Must use physical device for push notifications');
//     return null;
//   }
// }

// async function registerDevicePushTokenOnTDXServer(pushToken: string) {
//   let userID = await AuthTokenStore.getUserID();
//   let data = await PushTokenController.store(userID, pushToken);
//   return data;
// }

// export default function App() {
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   useEffect(() => {
//     registerForPushNotificationsAsync()
//       .then((token) => setFcmToken(token))
//       .catch((error: Error) => console.error('Registration error:', error));
//     const unsubscribe = onMessage(messaging, (remoteMessage) => {
//       console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
//       // Handle the incoming message here
//       Notifications.scheduleNotificationAsync({
//         content: {
//           title: remoteMessage.notification?.title || 'New Message',
//           body:  remoteMessage.notification?.body || '',
//           data:  remoteMessage.data,
//         },
//         trigger: null, // null means show immediately
//       });
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthProvider>
//       <AppNavigator />
//     </AuthProvider>
//   );
// }



