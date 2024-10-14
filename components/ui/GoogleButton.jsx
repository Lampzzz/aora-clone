import { images } from "@/constants";
import { googleLogin } from "@/firebase/auth";
import { View, Text, TouchableOpacity, Image } from "react-native";

const Seperator = () => {
  return (
    <View className="flex items-center space-x-3 flex-row my-5">
      <View className="bg-[#7B7B8B] h-[1px] flex-1" />
      <Text className="text-gray-100">Or</Text>
      <View className="bg-[#7B7B8B] h-[1px] flex-1" />
    </View>
  );
};

const GoogleButton = ({ label }) => {
  return (
    <View>
      <Seperator />
      <TouchableOpacity
        onPress={googleLogin}
        activeOpacity={1}
        className="flex flex-row space-x-1 items-center justify-center border border-[#7B7B8B] rounded-full py-3 active:bg-black-100"
      >
        <Image
          source={images.google}
          resizeMode="contain"
          className="w-5 h-5"
        />
        <Text className="text-gray-200">{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoogleButton;
