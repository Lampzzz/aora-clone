import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "@firebase/firestore";

import { icons } from "../constants";
import { db } from "../services/firebase";
import { useGlobalContext } from "../context/GlobalProvider";

const VideoCard = ({ id, title, creator, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      setLoading(true);
      try {
        const bookmarksCollectionRef = collection(db, "bookmarks");
        const q = query(
          bookmarksCollectionRef,
          where("videoid", "==", id),
          where("userid", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setBookmark(true);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [id, user.uid]);

  const handleBookmark = async () => {
    setLoading(true);

    try {
      const bookmarksCollectionRef = collection(db, "bookmarks");
      const q = query(
        bookmarksCollectionRef,
        where("videoid", "==", id),
        where("userid", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If bookmark exists, remove it
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, "bookmarks", docSnapshot.id));
        });
        setBookmark(false);
        ToastAndroid.show("Bookmark removed", ToastAndroid.SHORT);
      } else {
        // If bookmark does not exist, add it
        await addDoc(bookmarksCollectionRef, { videoid: id, userid: user.uid });
        setBookmark(true);
        ToastAndroid.show("Bookmark added", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={require("../assets/images/avatar.jpg")}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

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

        <View className="pt-2">
          <Pressable onPress={handleBookmark}>
            {loading ? (
              <ActivityIndicator size="small" color="#FF9C01" />
            ) : bookmark ? (
              <FontAwesome name="bookmark" size={24} color="#FF9C01" />
            ) : (
              <FontAwesome name="bookmark-o" size={24} color="#FF9C01" />
            )}
          </Pressable>
        </View>
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
  );
};

export default VideoCard;
