import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";

import { icons } from "../constants";
import { ActionSheet } from "react-native-ui-lib";
import { useGlobalContext } from "../context/GlobalProvider";
import useActionSheet from "../hooks/useActionSheet";
import Avatar from "./Avatar";
import toggleBookmark from "./toogleBookmark";

const VideoCard = ({ id, uid, title, creator, thumbnail, video }) => {
  const { bookmarkPosts } = useGlobalContext();
  const { isVisible, open, close } = useActionSheet();
  const [play, setPlay] = useState(false);

  const isBookmarked = bookmarkPosts.some(
    (bookmark) => bookmark.videoid === id
  );

  return (
    <>
      <View className="flex flex-col items-center px-4 mb-14">
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
            source={{ uri: video }}
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
              source={{ uri: thumbnail }}
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
          {
            label: isBookmarked ? "Remove to bookmark" : "Add to bookmark",
            onPress: () => toggleBookmark(id),
          },
          {
            label: "Delete Post",
            onPress: () => console.log("Option 2 selected"),
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
    </>
  );
};

export default VideoCard;
