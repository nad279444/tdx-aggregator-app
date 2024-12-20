export default ({ config }) => ({
    expo: {
      name: "tdxapps",
      slug: "tdxapps",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        supportsTablet: true
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.tdxapps.aggregator",
        googleServicesFile: "./android/app/google-services.json",
        jsEngine: "hermes"
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      extra: {
        eas: {
          projectId: "956056d4-195d-4c50-ae1b-76ed9dcb06c4"
        }
      },
      owner: "nad279444",
      plugins: ["expo-router"]
    }
  });
  