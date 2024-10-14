import clsx from "clsx";
import * as Yup from "yup";
import * as DocumentPicker from "expo-document-picker";
import { usePathname } from "expo-router";
import { Formik } from "formik";
import { ResizeMode, Video } from "expo-av";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from "react-native";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { icons } from "@/constants";
import { usePostStore } from "@/store/postStore";

const postValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  video: Yup.object().required("Video is required"),
  thumbnail: Yup.object().required("Thumbnail is required"),
});

const Create = () => {
  const { addPost, refetch } = usePostStore();
  const pathname = usePathname();
  const initialValues = {
    title: "",
    video: null,
    thumbnail: null,
  };

  const openPicker = async (selectType, setFieldValue) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === "image" ? "image/*" : "video/*",
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFieldValue(selectType === "image" ? "thumbnail" : "video", asset);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addPost({
        title: values.title,
        video: values.video.uri,
        thumbnail: values.thumbnail.uri,
      });

      ToastAndroid.show("Created Successfully", ToastAndroid.SHORT);
      resetForm();
      refetch();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 mt-10">
        <Text className="text-2xl text-white font-psemibold">Create Post</Text>
        <Formik
          initialValues={initialValues}
          validationSchema={postValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            errors,
            isSubmitting,
            handleSubmit,
            values,
            setFieldValue,
            resetForm,
          }) => {
            useEffect(() => {
              resetForm();
            }, [pathname]);

            return (
              <>
                <FormField
                  title="Title"
                  value={values.title}
                  styles="mt-10"
                  handleChangeText={handleChange("title")}
                  placeholder="Give your video a catchy title..."
                  error={errors.title && errors.title}
                />

                <View className="mt-7 space-y-2">
                  <Text className="text-sm font-pmedium text-gray-100 mb-2">
                    Video
                  </Text>
                  {values.video ? (
                    <Video
                      source={{ uri: values.video.uri }}
                      useNativeControls
                      className="w-full h-64 rounded-lg"
                      resizeMode={ResizeMode.COVER}
                      isLooping
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => openPicker("video", setFieldValue)}
                      >
                        <View
                          className={clsx(
                            "w-full h-40 bg-black-100 border-2 rounded-lg items-center justify-center",
                            errors.video ? "border-red-500" : "border-black-200"
                          )}
                        >
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
                      {errors.video && (
                        <Text className="text-red-500 text-sm ms-5 mt-2">
                          {errors.video}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                <View className="mt-7 space-y-2">
                  <Text className="text-sm font-pmedium text-gray-100 mb-2">
                    Thumbnail
                  </Text>
                  {values.thumbnail ? (
                    <Image
                      source={{ uri: values.thumbnail.uri }}
                      className="w-full h-64 rounded-lg"
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => openPicker("image", setFieldValue)}
                      >
                        <View
                          className={clsx(
                            "w-full h-12 bg-black-100 border-2 rounded-lg items-center justify-center flex-row space-x-2",
                            errors.video ? "border-red-500" : "border-black-200"
                          )}
                        >
                          <Image
                            source={icons.upload}
                            className="w-5 h-5"
                            resizeMode="contain"
                            alt="upload"
                          />
                          <Text className="text-sm text-gray-100 font-pmedium">
                            Choose a image
                          </Text>
                        </View>
                      </TouchableOpacity>
                      {errors.thumbnail && (
                        <Text className="text-red-500 text-sm ms-5 mt-2">
                          {errors.thumbnail}
                        </Text>
                      )}
                    </>
                  )}
                </View>

                <Button
                  title="Publish"
                  handlePress={handleSubmit}
                  styles="mt-7 mb-4"
                  isLoading={isSubmitting}
                />
              </>
            );
          }}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
