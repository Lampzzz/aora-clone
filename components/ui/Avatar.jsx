import { Image, View } from "react-native";

import { images } from "@/constants";

const Avatar = () => {
  return (
    <View className="w-14 h-14 border-2 flex justify-center items-center">
      <Image
        source={images.avatar}
        className="w-full h-full rounded-lg"
        resizeMode="cover"
      />
    </View>
  );
};

export default Avatar;
