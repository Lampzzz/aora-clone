import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { useEffect, useState } from "react";

import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import SearchInput from "../../components/SearchInput";
import { getAllPosts } from "../../services/firebase";
import VideoCard from "../../components/VideoCard";
import useData from "../../hooks/useData";

const Home = () => {
  const { data: posts, refetch } = useData(getAllPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { userCredentials } = useGlobalContext();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (userCredentials) setUsername(userCredentials.username);
  }, [userCredentials]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4 space-y-6">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          renderItem={({ item }) => (
            <VideoCard
              key={item.id}
              id={item.id}
              title={item.title}
              thumbnail={item.thumbnailUri}
              video={item.videoUri}
              creator={item.username}
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
                    {username}
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
