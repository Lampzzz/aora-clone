import SearchInput from "@/components/SearchInput";
import PostsCard from "@/components/PostsCard";
import useData from "@/hooks/useData";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { images } from "@/constants";
import { getAllPosts } from "@/firebase/firestore";
import { useGlobalContext } from "@/context/GlobalProvider";

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
              uid={currentUser.id}
            />
          )}
          ListHeaderComponent={
            <View className="flex my-6">
              <View className="flex justify-between items-start flex-row mb-2">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">
                    Welcome Back
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    {currentUser?.username}
                  </Text>
                </View>

                <View>
                  <Image
                    source={images.logoSmall}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View className="mt-5 mb-10">
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
