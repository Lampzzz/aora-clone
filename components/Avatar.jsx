import { Image, View } from "react-native";
import { images } from "../constants";

const Avatar = () => {
  return (
    <View className="w-14 h-14 border border-secondary rounded-lg flex justify-center items-center">
      <Image
        source={images.avatar}
        className="w-[90%] h-[90%] rounded-lg"
        resizeMode="cover"
      />
    </View>
  );
};

export default Avatar;
