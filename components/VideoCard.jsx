import { useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";

import { icons } from "../constants";
import { ActionSheet } from "react-native-ui-lib";

const VideoCard = ({ id, uid, title, creator, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);

  const handleOpenActionSheet = () => {
    setIsActionSheetVisible(true); // Show ActionSheet
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetVisible(false); // Hide ActionSheet
  };

  return (
    <>
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

          <Pressable onPress={handleOpenActionSheet}>
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
        title={"Options"}
        visible={isActionSheetVisible}
        onDismiss={handleCloseActionSheet} // Correctly hide ActionSheet
        message={"Select an option"}
        cancelButtonIndex={3}
        destructiveButtonIndex={0}
        options={[
          {
            label: "Option 1",
            onPress: () => console.log("Option 1 selected"),
          },
          {
            label: "Option 2",
            onPress: () => console.log("Option 2 selected"),
          },
          { label: "Cancel", onPress: handleCloseActionSheet },
        ]}
      />
    </>
  );
};

export default VideoCard;
