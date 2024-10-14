import { Redirect, router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { images } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const App = () => {
  const { isLoading, isAuthenticated, initializeAuthListener } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, []);

  if (!isLoading && isAuthenticated) return <Redirect href="/home" />;

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <Container>
      <View className="w-full h-full items-center justify-center px-4">
        <Image
          source={images.logo}
          resizeMode="contain"
          className="w-[130px] h-[84px]"
        />
        <Image
          source={images.cards}
          resizeMode="contain"
          className="max-w-[380px] w-full h-[300]"
        />
        <View className="relative mt-5">
          <Text className="text-3xl text-white font-bold text-center">
            Discover Endless Possibilities with{" "}
            <Text className="text-secondary-200">Aora</Text>
          </Text>
          <Image
            source={images.path}
            resizeMode="contain"
            className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
          />
        </View>
        <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
          Where creativity meets innovations: embark on a journey of limitless
          exploration with Aora
        </Text>
        <Button
          title="Continue"
          handlePress={() => router.push("/login")}
          styles="w-full mt-7"
        />
      </View>
    </Container>
  );
};

export default App;
