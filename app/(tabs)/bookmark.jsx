import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/context/GlobalProvider";
import PostsCard from "@/components/PostsCard";
import { getAllBookmarkPosts } from "@/firebase/firestore";
import useData from "@/hooks/useData";

const Bookmark = () => {
  const { currentUser } = useGlobalContext();
  const {
    data: bookmarkPosts,
    onRefresh,
    refreshing,
  } = useData(() => getAllBookmarkPosts(currentUser?.id));

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold mb-10">Bookmark</Text>

      <FlatList
        data={bookmarkPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PostsCard
            video={item}
            lastIndex={index === bookmarkPosts.length - 1}
            uid={currentUser?.id}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center">
            <Text className="text-gray-100">No posts bookmark yet</Text>
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
    </SafeAreaView>
  );
};

export default Bookmark;
