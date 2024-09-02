import * as DocumentPicker from "expo-document-picker";
import { ResizeMode, Video } from "expo-av";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";

import { icons } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { newPosts } from "@/firebase/firestore";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const Create = () => {
  const initializeData = {
    title: "",
    video: null,
    thumbnail: null,
  };

  const { currentUser } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(initializeData);

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === "image" ? "image/*" : "video/*",
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      await newPosts(
        currentUser.auth_id,
        currentUser.username,
        form.title,
        form.video.uri,
        form.thumbnail.uri
      );

      ToastAndroid.show("Created Successfully", ToastAndroid.SHORT);
      setForm(initializeData);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-10">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          otherStyles="mt-10"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          placeholder="Give your video a catchy title..."
        />

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">
            Upload Video
          </Text>
          {form.video ? (
            <Video
              source={{ uri: form.video.uri }}
              useNativeControls
              className="w-full h-64 rounded"
              resizeMode={ResizeMode.COVER}
              isLooping
            />
          ) : (
            <TouchableOpacity onPress={() => openPicker("video")}>
              <View className="w-full h-40 bg-black-100 border-2 border-black-200 rounded items-center justify-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 rounded-xl justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    alt="uplaod"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">Thumbnail</Text>
          {form.thumbnail ? (
            <Image
              source={{ uri: form.thumbnail.uri }}
              className="w-full h-64 rounded"
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity onPress={() => openPicker("image")}>
              <View className="w-full h-12 bg-black-100 border-2 border-black-200 rounded items-center justify-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                  alt="upload"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <CustomButton
          title="Publish"
          handlePress={handleSubmit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
