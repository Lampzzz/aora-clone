import { View, Text, FlatList, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput";
import { getAllPosts, subscribeToPosts } from "../../services/firebase";
import Trending from "../../components/Trending";
import VideoCard from "../../components/VideoCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userCredentials } = useGlobalContext();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToPosts((newPosts) => {
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAndLogPosts = async () => {
      try {
        const posts = await getAllPosts();
        setPosts(posts);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAndLogPosts();
  }, []);

  useEffect(() => {
    if (userCredentials) setUsername(userCredentials.username);
  }, [userCredentials]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4 space-y-6">
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

        <SearchInput />

        {/* <View className="w-full flex-1 pt-5">
          <Text className="text-lg font-pregular text-gray-100 mb-3">
            Latest Videos
          </Text>
        </View> */}

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VideoCard
              key={item.id}
              title={item.title}
              thumbnail={item.videoUri}
              video={item.videoUri}
              creator={item.username}
            />
          )}
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <Text className="text-gray-100">No posts available</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
