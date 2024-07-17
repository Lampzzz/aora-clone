import { View, Text } from "react-native";
import React from "react";

const FormField = ({ value, handleChange, label }) => {
  return (
    <View className="space-y-2">
      <Text className="text-base text-gray=100 font-pmedium">{label}</Text>
    </View>
  );
};

export default FormField;
