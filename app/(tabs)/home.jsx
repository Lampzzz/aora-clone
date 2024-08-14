import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";

import { images } from "../../constants";
import { getAllPosts } from "../../services/firebase";
import SearchInput from "../../components/SearchInput";
import VideoCard from "../../components/VideoCard";
import useData from "../../hooks/useData";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, onRefresh, refreshing } = useData(getAllPosts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 space-y-6">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          renderItem={({ item }) => (
            <VideoCard
              key={item.id}
              id={item.id}
              uid={item.uid}
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              creator={item.user.username}
            />
          )}
          ListHeaderComponent={
            <View className="flex my-6 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {/* {user.username || "User"} */}
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

              <View className="mb-8">
                <SearchInput />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center justify-center">
              <Text className="text-gray-100">No posts available</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
