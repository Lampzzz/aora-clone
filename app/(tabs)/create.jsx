import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import FormField from "../../components/FormField";
import { icons } from "../../constants";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-4">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          otherStyles="mt-10"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          placeholder="Give your vidoe a catchy title..."
        />

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => {}}>
            <View className="w-full h-40 bg-black-100 border-2 border-black-200 rounded-2xl items-center justify-center">
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
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-sm font-pmedium text-gray-100">Thumbnail</Text>

          <TouchableOpacity onPress={() => {}}>
            <View className="w-full h-16 bg-black-100 border-2 border-black-200 rounded-2xl items-center justify-center flex-row space-x-2">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
