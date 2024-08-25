import useData from "@/hooks/useData";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import PostsCard from "@/components/PostsCard";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllPosts } from "@/firebase/firestore";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useData(() => searchPosts(query));

  const searchPosts = async (searchQuery) => {
    try {
      const posts = await getAllPosts();
      const result = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <PostsCard video={item} />}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4">
            <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white mt-1">
              {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} refetch={refetch} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
