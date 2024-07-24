import { View, Text, FlatList, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { doc, getDoc } from "@firebase/firestore";

import { images } from "../../constants";
import { auth, db } from "../../services/firebase";

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;

        if (!user) return Alert.alert("No user is signed in");

        const uid = user.uid;
        const userDoc = await getDoc(doc(db, "users", uid));

        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          Alert.alert("Error", "No such document!");
        }

        fetchUser();
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
  }, []);

  return (
    <SafeAreaView className="bg-primary">
      <View className="my-6 px-4 space-y-6">
        <View className="flex justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {username}
            </Text>
          </View>
          <View className="mt-1.5">
            <Image
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
