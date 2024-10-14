import { Text, TouchableOpacity } from "react-native";
import React from "react";
import clsx from "clsx";

const Button = ({ title, handlePress, styles, isLoading }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={clsx(
        "bg-secondary rounded-full py-2 justify-center items-center",
        styles,
        isLoading ? "opacity-50" : ""
      )}
    >
      <Text className="text-primary font-psemibold text-base">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
