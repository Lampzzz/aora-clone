import clsx from "clsx";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";

const Header = ({ label, handleOnPress, styles }) => {
  return (
    <View className={clsx("justify-between items-center flex-row", styles)}>
      <View className="flex flex-row items-center gap-5">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className=" active:bg-black-200 rounded-lg"
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            className="w-4 h-4"
            tintColor="white"
          />
        </TouchableOpacity>
        <Text className="text-xl text-white font-psemibold">{label}</Text>
      </View>
      {label === "Edit Post" && (
        <TouchableOpacity activeOpacity={0.7} onPress={handleOnPress}>
          <Image
            source={icons.trash}
            resizeMode="contain"
            className="w-5 h-5"
            tintColor="#EF4444"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
