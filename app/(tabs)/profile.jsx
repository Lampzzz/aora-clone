import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  RefreshControl,
} from "react-native";

import InfoBox from "@/components/InfoBox";
import PostsCard from "@/components/PostsCard";
import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllUserPosts, logout } from "@/firebase/firestore";
import Avatar from "@/components/Avatar";
import useData from "@/hooks/useData";

const Profile = () => {
  const { currentUser } = useGlobalContext();
  const {
    data: userPosts,
    onRefresh,
    refreshing,
  } = useData(() => getAllUserPosts(currentUser.id));

  return (
    <SafeAreaView className="bg-primary h-full px-4">
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        renderItem={({ item, index }) => (
          <PostsCard video={item} lastIndex={index === userPosts.length - 1} />
        )}
        ListHeaderComponent={
          <View className="w-full justify-center items-center mt-6 mb-12">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-5 h-5"
              />
            </TouchableOpacity>

            <Avatar />

            <InfoBox
              title={currentUser?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={userPosts?.length}
                subtitle="Posts"
                containerStyles="mr-10"
              />
              <InfoBox title="1.2k" subtitle="Followers" />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-200">No posts created</Text>
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

export default Profile;
