import clsx from "clsx";
import { View, Text, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";

const ProfileButton = ({ handlePress, label, icon, styles }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      className={clsx("mb-3 active:bg-black-100 rounded-lg", styles)}
    >
      <View className="flex-row justify-between items-center p-3">
        <View className="flex-row gap-5">
          <Image
            source={icon}
            resizeMethod="contain"
            className="w-5 h-5"
            tintColor="#CDCDE0"
          />
          <Text className="text-gray-200 font-pmedium">{label}</Text>
        </View>
        {label !== "Logout" && (
          <Image
            source={icons.rightArrow}
            resizeMethod="contain"
            className="w-3 h-3"
            tintColor="#CDCDE0"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProfileButton;
