import { View, Text } from "react-native";

const InfoBox = ({ title, subtitle, styles }) => {
  return (
    <View className={styles}>
      <Text className="text-white text-center font-psemibold text-lg">
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
