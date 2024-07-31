import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "@firebase/auth";

import { icons } from "../../constants";
import { auth } from "../../services/firebase";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";

const Profile = () => {
  const { userCredentials } = useGlobalContext();

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      Alert.alert("Logout Succesfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
            onPress={logout}
            className="flex w-full items-end mb-10"
          >
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
            <Image
              source={require("../../assets/images/avatar.jpg")}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode="cover"
            />
          </View>

          <InfoBox title="User" containerStyles="mt-5" titleStyles="text-lg" />

          <View className="mt-5 flex flex-row">
            <InfoBox
              title={0}
              subtitle="Posts"
              titleStyles="text-xl"
              containerStyles="mr-10"
            />
            <InfoBox title="1.2k" subtitle="Followers" titleStyles="text-xl" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
