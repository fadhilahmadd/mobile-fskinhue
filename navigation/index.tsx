import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from "../screens/HomeScreen";
import { RootStackParamList } from "../types";
import DetectionScreen from "../screens/DetectionScreen";
import SplashScreen from "../screens/SplashScreen";
import OutfitDetail from "../screens/OutfitDetail";
import WarnaDetail from "../screens/DeteksiWarna/WarnaDetail";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPassword";
import ResetPasswordScreen from "../screens/Auth/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/Auth/VerifyOTPScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Splash');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("Token retrieved:", token);
      if (token) {
        setInitialRoute('Deteksi');
      } else {
        setInitialRoute('Login');
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOTPScreen} />
      <Stack.Screen name="Deteksi" component={DetectionScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="OutfitDetail" component={OutfitDetail} />
      <Stack.Screen name="WarnaDetail" component={WarnaDetail} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
