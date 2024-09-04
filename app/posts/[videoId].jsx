import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { ResizeMode, Video } from "expo-av";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";

import { editPost, getPost } from "@/firebase/firestore";
import useData from "@/hooks/useData";
import FormField from "@/components/FormField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";

const EditPost = () => {
  const { videoId } = useLocalSearchParams();
  const { data, refetch } = useData(() => getPost(videoId));
  const [post, setPost] = useState({});
  const [uploading, setUploading] = useState(false);
  const [newPost, setNewPost] = useState({
    thumbnail: "",
    video: "",
  });

  useEffect(() => {
    setPost(data);
  }, [data]);

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === "image" ? "image/*" : "video/*",
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setNewPost({
          ...newPost,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setNewPost({
          ...newPost,
          video: result.assets[0],
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      const updatedPost = {
        ...post,
        video_url: newPost.video.uri,
        thumbnail_url: newPost.thumbnail.uri,
      };

      await editPost(videoId, updatedPost);

      console.log(JSON.stringify(updatedPost, null, 2));

      ToastAndroid.show("Created Successfully", ToastAndroid.SHORT);
      refetch();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-10">
        <Text className="text-2xl text-white font-psemibold">Edit Video</Text>

        <FormField
          title="Video Title"
          value={post.title}
          otherStyles="mt-10"
          handleChangeText={(e) => setPost({ ...post, title: e })}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">
            Upload Video
          </Text>

          <Video
            source={{
              uri: newPost.video ? newPost.video.uri : post.video_url,
            }}
            useNativeControls
            className="w-full h-64 rounded"
            resizeMode={ResizeMode.COVER}
            isLooping
          />
          <TouchableOpacity onPress={() => openPicker("video")}>
            <View className="w-full h-12 bg-black-100 border-2 border-black-200 rounded items-center justify-center flex-row space-x-2">
              <Image
                source={icons.upload}
                className="w-5 h-5"
                resizeMode="contain"
                alt="upload"
              />
              <Text className="text-sm text-gray-100 font-pmedium">
                Change video
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">Thumbnail</Text>
          <Image
            source={{
              uri: newPost.thumbnail
                ? newPost.thumbnail.uri
                : post.thumbnail_url,
            }}
            className="w-full h-64 rounded"
            resizeMode="cover"
          />
          <TouchableOpacity onPress={() => openPicker("image")}>
            <View className="w-full h-12 bg-black-100 border-2 border-black-200 rounded items-center justify-center flex-row space-x-2">
              <Image
                source={icons.upload}
                className="w-5 h-5"
                resizeMode="contain"
                alt="upload"
              />
              <Text className="text-sm text-gray-100 font-pmedium">
                Change thumbnail
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Edit Post"
          handlePress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPost;
