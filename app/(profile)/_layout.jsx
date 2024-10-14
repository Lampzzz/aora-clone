import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarStyle: { display: "none" },
      }}
    >
      <Stack.Screen name="my-posts" />
      <Stack.Screen name="bookmark" />
    </Stack>
  );
};

export default _layout;
