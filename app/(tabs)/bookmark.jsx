import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "../../context/GlobalProvider";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const { bookmarkPosts } = useGlobalContext();

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold mb-10">Bookmark</Text>

      <FlatList
        data={bookmarkPosts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <VideoCard
            id={item.id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.username}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center">
            <Text className="text-gray-100">No posts bookmark yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
