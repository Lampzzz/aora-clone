import clsx from "clsx";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ToastAndroid,
} from "react-native";

import Avatar from "./Avatar";
import { icons } from "@/constants";
import { router } from "expo-router";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { useAuthStore } from "@/store/authStore";

const PostsCard = ({ post, lastIndex }) => {
  const { id, user_id, creator, title, thumbnail, video } = post;
  const { bookmarks, refetch, togglePostBookmark } = useBookmarkStore();
  const { currentUser } = useAuthStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      const bookmarkExist = bookmarks.some(
        (bookmark) => bookmark.post.id === id
      );

      setIsBookmarked(bookmarkExist);
    };

    checkIfBookmarked();
  }, [bookmarks, id, refetch]);

  const handleToggleBookmark = async () => {
    setModalVisible(false);

    try {
      const message = await togglePostBookmark(id);
      ToastAndroid.show(message, ToastAndroid.SHORT);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <View
        className={clsx(
          "lex flex-col items-center",
          lastIndex ? "mb-3" : "mb-10"
        )}
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

          <Pressable onPress={toggleModal}>
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

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          className="flex justify-end"
        >
          <View className="bg-primary py-3 px-5 rounded-lg">
            <View className="justify-center space-y-5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleToggleBookmark}
                className="rounded-full active:bg-black-100"
              >
                <View className="py-3 rounded-full w-full ">
                  <Text className="text-gray-200 font-pmedium text-center text-xs">
                    {isBookmarked ? "Remove from Bookmark" : "Add to Bookmark"}
                  </Text>
                </View>
              </TouchableOpacity>
              {user_id === currentUser?.id && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push(`/post/${id}`)}
                  className="rounded-full active:bg-black-100"
                >
                  <View className="py-3 rounded-full w-full ">
                    <Text className="text-gray-200 font-pmedium text-center text-xs">
                      Edit Post
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={1}
                onPress={toggleModal}
                className="rounded-full active:bg-black-100"
              >
                <View className="py-3 rounded-full w-full ">
                  <Text className="text-red-500 font-pmedium text-center text-xs">
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default PostsCard;
