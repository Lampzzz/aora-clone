import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import PostsCard from "@/components/ui/PostsCard";
import { usePostStore } from "@/store/postStore";
import Header from "@/components/ui/Header";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { posts } = usePostStore();
  const [searchResults, setSearchResults] = useState();

  useEffect(() => {
    const searchPosts = (searchQuery) => {
      try {
        const result = posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return result;
      } catch (error) {
        throw new Error(error.message);
      }
    };

    setSearchResults(searchPosts(query));
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full my-6 px-4">
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        renderItem={({ item }) => <PostsCard post={item} />}
        ListHeaderComponent={() => (
          <View className="flex">
            <Header label="Back to home" styles="mb-10" />

            <Text className="font-pmedium text-gray-100 text-sm">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white mt-1">
              {query}
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
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
