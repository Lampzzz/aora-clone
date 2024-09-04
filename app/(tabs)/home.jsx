import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";

import { images } from "@/constants";
import { getAllPosts } from "@/firebase/firestore";
import { useGlobalContext } from "@/context/GlobalProvider";
import Trending from "@/components/Trending";
import SearchInput from "@/components/SearchInput";
import PostsCard from "@/components/PostsCard";
import useData from "@/hooks/useData";
import EmptyState from "@/components/EmptyState";

const Home = () => {
  const { currentUser } = useGlobalContext();
  const { data: posts, onRefresh, refreshing } = useData(getAllPosts);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 space-y-6">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          renderItem={({ item, index }) => (
            <PostsCard
              video={item}
              lastIndex={index === posts.length - 1}
              userId={currentUser.id}
              videoId={item.id}
            />
          )}
          ListHeaderComponent={
            <View className="flex my-6">
              <View className="flex justify-between items-start flex-row mb-5">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {currentUser?.username}
                  </Text>
                </View>

                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>

              <SearchInput />

              <View className="w-full flex-1 mt-10">
                <Text className="text-lg font-pregular text-gray-100 mb-3">
                  Latest Videos
                </Text>

                <Trending posts={posts ?? []} />
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title="No Videos Found"
              subtitle="No videos created yet"
              buttonTitle="Create Posts"
              buttonLink="/create"
            />
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
