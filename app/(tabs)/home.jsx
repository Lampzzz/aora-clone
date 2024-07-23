import { View, Text, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";

const Home = () => {
  return (
    <SafeAreaView className="bg-primary">
      <View className="my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              JSMastery
            </Text>
          </View>

          <View className="mt-1.5">
            <Image
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <FlatList data={[{ id: 1 }]} keyExtractor={(item) => item.id} />
    </SafeAreaView>
  );
};

export default Home;
