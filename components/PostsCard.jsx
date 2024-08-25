import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import Avatar from "./Avatar";
import useActionSheet from "@/hooks/useActionSheet";
import ActionSheet from "react-native-ui-lib/actionSheet";
import { icons } from "@/constants";
import { usePathname } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import useData from "@/hooks/useData";
import { getAllBookmarkPosts } from "@/firebase/firestore";

const PostsCard = ({ video, lastIndex, uid }) => {
  const pathname = usePathname();
  const { id, user_id, title, creator, thumbnail_url, video_url } = video;
  const { data: bookmarkPosts } = useData(() => getAllBookmarkPosts(user_id));
  const { isVisible, open, close } = useActionSheet();
  const [isLaoding, setIsLoading] = useState(false);
  const [play, setPlay] = useState(false);
  const isBookmarked = bookmarkPosts.some((post) => post.video_id === id);

  return (
    <>
      <View
        className={`flex flex-col items-center ${lastIndex ? "mb-3" : "mb-10"}`}
      >
        <View className="flex flex-row gap-3 items-start">
          <View className="flex justify-center items-center flex-row flex-1">
            <Avatar />

            <View className="flex justify-center flex-1 ml-3 gap-y-1">
              <Text
                className="font-psemibold text-sm text-white"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-xs text-gray-100 font-pregular"
                numberOfLines={1}
              >
                {creator}
              </Text>
            </View>
          </View>

          <Pressable onPress={open}>
            <View className="pt-2">
              <Image
                source={icons.menu}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          </Pressable>
        </View>

        {play ? (
          <Video
            source={{ uri: video_url }}
            className="w-full h-60 rounded-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
            className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
          >
            <Image
              source={{ uri: thumbnail_url }}
              className="w-full h-full rounded-xl mt-3"
              resizeMode="cover"
            />

            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      <ActionSheet
        visible={isVisible}
        onDismiss={close}
        containerStyle={{
          backgroundColor: "#161622",
        }}
        optionsStyle={{ rowGap: 20 }}
        options={[
          pathname === "/bookmark"
            ? {
                label: "Remove bookmark",
                onPress: () => {
                  console.log("Bookmark!");
                  close();
                },
              }
            : {
                label: isBookmarked ? "Remove bookmark" : "Add to bookmark",
                onPress: () => {
                  console.log("Bookmark!");
                  close();
                },
              },
          uid === user_id && {
            label: "Edit Post",
            onPress: () => console.log("delete posts"),
          },
          uid === user_id && {
            label: "Delete Post",
            onPress: () => console.log("delete posts"),
          },
          {
            label: "Cancel",
            onPress: close,
          },
        ]}
        renderAction={(option, index) => (
          <Pressable
            key={index}
            onPress={() => option.onPress()}
            className="bg-primary rounded-full p-3"
          >
            <Text className="text-center text-gray-200">{option.label}</Text>
          </Pressable>
        )}
      />
      {isLaoding && (
        <View className="bg-primary h-full items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </>
  );
};

export default PostsCard;
