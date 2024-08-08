import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, TouchableOpacity, FlatList, Text } from "react-native";

import InfoBox from "../../components/InfoBox";
import VideoCard from "../../components/VideoCard";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { logout } from "../../services/firebase";

const Profile = () => {
  const { user, userPosts } = useGlobalContext();

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        renderItem={({ item }) => (
          <VideoCard
            id={item.id}
            uid={item.userid}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
          />
        )}
        ListHeaderComponent={
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={require("../../assets/images/avatar.jpg")}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user.username || ""}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={userPosts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-200">No posts created</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
