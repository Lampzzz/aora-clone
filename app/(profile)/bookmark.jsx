import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, FlatList, RefreshControl } from "react-native";

import PostsCard from "@/components/ui/PostsCard";
import EmptyState from "@/components/ui/EmptyState";
import Header from "@/components/ui/Header";
import { PostSkeleton } from "@/components/ui/Skeleton";
import { useBookmarkStore } from "@/store/bookmarkStore";

const Bookmark = () => {
  const { bookmarks, refetch, isLoading, refreshing, fetchBookmarks } =
    useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 mt-10">
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <PostsCard
              post={item.post}
              lastIndex={index === bookmarks.length - 1}
            />
          )}
          ListEmptyComponent={
            <EmptyComponent isLoading={isLoading} posts={bookmarks} />
          }
          ListHeaderComponent={
            <Header
              label={bookmarks.length > 1 ? "Bookmarks" : "Bookmark"}
              styles="mb-10"
            />
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
    return <PostSkeleton />;
  } else if (!isLoading && posts.length === 0) {
    return (
      <EmptyState
        title="No bookmark found"
        subtitle="No bookmark added yet"
        buttonTitle="Add Bookmark"
        buttonLink="/home"
      />
    );
  }
};

export default Bookmark;
