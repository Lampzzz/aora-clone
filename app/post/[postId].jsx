import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";

import FormField from "@/components/ui/FormField";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { icons, images } from "@/constants";
import { usePostStore, useUserPostStore } from "@/store/postStore";

const EditPost = () => {
  const { postId } = useLocalSearchParams();
  const { removePost } = useUserPostStore();
  const { post, fetchPost, isLoading } = usePostStore();
  const { updatePost } = useUserPostStore();
  const [editPost, setEditPost] = useState();

  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState();
  const [newPost, setNewPost] = useState({
    thumbnail: "",
    video: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        await fetchPost(postId);
      }
    };

    fetchData();
  }, [postId, handleSubmit]);

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
    setUploading(true);

    try {
      const updatedPost = {
        ...post,
        video_url: newPost.video.uri,
        thumbnail_url: newPost.thumbnail.uri,
      };

      await updatePost(postId, updatedPost);

      ToastAndroid.show("Edited Successfully", ToastAndroid.SHORT);
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = () => {
    removePost(postId);
    ToastAndroid.show("Deleted Successfully", ToastAndroid.SHORT);
    setShowModal(false);

    router.back();
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-10">
        <Header label="Edit Post" handleOnPress={() => setShowModal(true)} />

        <FormField
          title="Title"
          value={post.title}
          styles="mt-10"
          handleChangeText={(e) => setPost({ ...post, title: e })}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">Video</Text>

          <Video
            source={{
              uri: newPost.video ? newPost.video.uri : post.video_url,
            }}
            useNativeControls
            className="w-full h-64 rounded-lg"
            resizeMode={ResizeMode.COVER}
            isLooping
          />
          <TouchableOpacity onPress={() => openPicker("video")}>
            <View className="w-full h-12 bg-black-100 border-2 border-black-200 rounded-lg items-center justify-center flex-row space-x-2">
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
            className="w-full h-64 rounded-lg"
            resizeMode="cover"
          />
          <TouchableOpacity onPress={() => openPicker("image")}>
            <View className="w-full h-12 bg-black-100 border-2 border-black-200 rounded-lg items-center justify-center flex-row space-x-2">
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

        <Button
          title="Edit Post"
          handlePress={handleSubmit}
          styles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>

      <Loader isLoading={isLoading} />

      <ConfirmationModal
        isModalVisible={showModal}
        onPressCancel={() => setShowModal(false)}
        onPressConfirm={handleDelete}
        image={images.warning}
        title="Delete Post"
        subtitle="You are going to delete the post, Are you sure?"
      />
    </SafeAreaView>
  );
};

export default EditPost;
