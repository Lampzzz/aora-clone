import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
} from "@firebase/firestore";

import { icons } from "../constants";
import { ActionSheet } from "react-native-ui-lib";
import { useGlobalContext } from "../context/GlobalProvider";
import useActionSheet from "../hooks/useActionSheet";
import Avatar from "./Avatar";
import { db } from "../services/firebase";

const VideoCard = ({ id, uid, title, creator, thumbnail, video }) => {
  const { bookmarkPosts, user } = useGlobalContext();
  const { isVisible, open, close } = useActionSheet();
  const [laoding, setLoading] = useState(false);
  const [play, setPlay] = useState(false);

  console.log(bookmarkPosts);

  console.log(JSON.stringify(bookmarkPosts, null, 2));

  const isBookmarked = bookmarkPosts.some((bookmark) => bookmark.id === id);

  const toggleBookmark = async (id) => {
    setLoading(true);

    try {
      if (!user) throw new Error("User not found");

      if (isBookmarked) {
        // Remove bookmark
        await deleteDoc(doc(db, "bookmarks", id));
      } else {
        // Add bookmark
        await addDoc(collection(db, "bookmarks"), {
          uid: user.uid,
          videoid: id,
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

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
            onPress: () => {
              toggleBookmark(id);
              close();
              console.log("Bookmark!");
            },
          },
          user.uid === uid && {
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
      {/* {laoding && (
        <View className="bg-primary h-full items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )} */}
    </>
  );
};

export default VideoCard;
