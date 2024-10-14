import { View } from "react-native";
import React from "react";

const Skeleton = () => {
  return (
    <View className="mb-10">
      <View className="flex flex-row gap-3 items-start">
        <View className="bg-black-200 w-14 h-14 rounded-lg" />
        <View className="ml-2">
          <View className="bg-black-200 w-20 h-5 mb-1" />
          <View className="bg-black-200 w-10 h-5" />
        </View>
      </View>
      <View className="bg-black-200 w-full h-60 mt-3 rounded-lg" />
    </View>
  );
};

export const PostSkeleton = () => {
  return (
    <View>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </View>
  );
};

export const NameSkeleton = () => {
  return <View className="bg-black-200 w-40 h-8" />;
};

export const TrendingSkeleton = () => {
  return (
    <View className="flex justify-center items-center flex-row space-x-6 mb-10">
      <View className="bg-black-200 flex-1 h-64 mt-2 rounded-r-lg" />
      <View className="bg-black-200 w-52 h-72 mt-2 rounded-lg" />
      <View className="bg-black-200 flex-1 h-64 mt-2 rounded-l-lg" />
    </View>
  );
};
