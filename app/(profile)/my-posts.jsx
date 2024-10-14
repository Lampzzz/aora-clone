import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList, RefreshControl } from "react-native";

import PostsCard from "@/components/ui/PostsCard";
import EmptyState from "@/components/ui/EmptyState";
import Header from "@/components/ui/Header";
import { PostSkeleton } from "@/components/ui/Skeleton";
import { usePostStore } from "@/store/postStore";

const MyPosts = () => {
  const { userPosts, refreshing, isLoading, refetch, fetchUserPosts } =
    usePostStore();

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 mt-10">
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <PostsCard post={item} lastIndex={index === userPosts.length - 1} />
          )}
          ListEmptyComponent={
            <EmptyComponent isLoading={isLoading} posts={userPosts} />
          }
          ListHeaderComponent={<Header label="My Posts" styles="mb-10" />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => refetch(true)}
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
    return <PostSkeleton />;
  } else if (!isLoading && posts.length === 0) {
    return (
      <EmptyState
        title="No Videos Found"
        subtitle="No videos created yet"
        buttonTitle="Create Posts"
        buttonLink="/create"
      />
    );
  }
};

export default MyPosts;
