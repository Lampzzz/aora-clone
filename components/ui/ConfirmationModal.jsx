import Modal from "react-native-modal";
import { View, Text, TouchableOpacity, Image } from "react-native";

const ConfirmationModal = ({
  isModalVisible,
  title,
  subtitle,
  onPressCancel,
  image,
  onPressConfirm,
  choiceOne = "No",
  choiceTwo = "Yes",
}) => {
  return (
    <Modal isVisible={isModalVisible}>
      <View className="bg-primary rounded-lg p-7 w-9/10 mx-auto">
        <Image
          source={image}
          resizeMode="contain"
          className="w-16 h-16 mx-auto mb-5"
        />
        <Text className="text-gray-200 text-center font-pmedium text-base">
          {title}
        </Text>
        <Text className="text-slate-500 text-center text-base">{subtitle}</Text>

        <View className="justify-center flex-row mt-5 gap-x-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressCancel}
            className="flex-1"
          >
            <View className="border border-secondary-100 px-5 py-2 rounded-full w-full">
              <Text className="text-secondary-100 font-pmedium text-center">
                {choiceOne}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressConfirm}
            className="flex-1"
          >
            <View className="bg-secondary-100 border border-secondary-100 px-5 py-2 rounded-full w-full">
              <Text className="text-primary font-pmedium text-center">
                {choiceTwo}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
