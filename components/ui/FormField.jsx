import clsx from "clsx";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "@/constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  styles,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={clsx("space-y-2", styles)}>
      <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>
      <View
        className={clsx(
          "w-full h-12 bg-black-100 border-2 px-4 rounded-lg items-center flex-row",
          error ? "border-red-500" : "border-black-200 focus:border-secondary"
        )}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-sm"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm ms-5">{error}</Text>}
    </View>
  );
};

export default FormField;
