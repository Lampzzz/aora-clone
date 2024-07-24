import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  error,
  touch,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-sm text-gray-100 font-pmedium">{title}</Text>
      <View
        className={`w-full h-12 bg-black-100 border-2 px-4 rounded-2xl  items-center flex-row ${
          error && touch
            ? "border-red-500"
            : "border-black-200 focus:border-secondary"
        }`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base "
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
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

      {error && touch && (
        <Text className="text-red-500 text-sm ms-5">{error}</Text>
      )}
    </View>
  );
};

export default FormField;
