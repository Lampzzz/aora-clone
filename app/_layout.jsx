import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

import { fonts } from "@/constants";
import GlobalProvider from "@/context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": fonts.black,
    "Poppins-Bold": fonts.black,
    "Poppins-ExtraBold": fonts.extraBold,
    "Poppins-ExtraLight": fonts.extraLight,
    "Poppins-Light": fonts.light,
    "Poppins-Regular": fonts.regular,
    "Poppins-SemiBold": fonts.semiBold,
    "Poppins-Thin": fonts.thin,
    "Poppins-Medium": fonts.medium,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="search/[query]" />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
