import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "@/constants";
import Button from "./Button";

const EmptyState = ({
  title,
  subtitle,
  buttonTitle = "Back to Explore",
  buttonLink = "/home",
}) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <Button
        title={buttonTitle}
        handlePress={() => router.push(buttonLink)}
        styles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
