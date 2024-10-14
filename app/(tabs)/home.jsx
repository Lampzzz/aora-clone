import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";

import Trending from "@/components/screen/Trending";
import SearchInput from "@/components/ui/SearchInput";
import PostsCard from "@/components/ui/PostsCard";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { images } from "@/constants";
import {
  TrendingSkeleton,
  PostSkeleton,
  NameSkeleton,
} from "@/components/ui/Skeleton";

const Home = () => {
  const { currentUser } = useAuthStore();
  const { posts, refreshing, isLoading, refetch, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 space-y-6">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          renderItem={({ item, index }) => (
            <PostsCard post={item} lastIndex={index === posts.length - 1} />
          )}
          ListHeaderComponent={
            <View className="flex my-6">
              <View className="flex justify-between items-start flex-row mb-5">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {currentUser?.username ?? <NameSkeleton />}
                  </Text>
                </View>

                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>

              <SearchInput />

              <View className="w-full mt-10">
                <Text className="text-lg font-pregular text-gray-100 mb-3">
                  Latest Videos
                </Text>
                <Trending posts={posts ?? []} />
              </View>
            </View>
          }
          ListEmptyComponent={
            <EmptyComponent isLoading={isLoading} posts={posts} />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetch}
              tintColor="#fff"
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const EmptyComponent = ({ isLoading, posts }) => {
  if (isLoading) {
    return (
      <>
        <TrendingSkeleton />
        <PostSkeleton />
      </>
    );
  }

  return posts.length === 0 ? (
    <EmptyState
      title="No Videos Found"
      subtitle="No videos created yet"
      buttonTitle="Create Posts"
      buttonLink="/create"
    />
  ) : null;
};

export default Home;
