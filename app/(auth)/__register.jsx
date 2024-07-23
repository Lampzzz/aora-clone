import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "@firebase/auth";

import { app, db, collection, addDoc } from "../../services/firebase";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const Register = () => {
  const initailValues = {
    username: "",
    email: "",
    password: "",
  };

  const auth = getAuth(app);
  const [formValues, setFormValues] = useState(initailValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );

      const userData = {
        username: formValues.username,
        email: formValues.email,
      };

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        ...userData,
      });

      Alert.alert("Success", "Registration Succesffuly");
      setFormValues(initailValues);
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full h-[90vh] justify-center px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-white text-xl text-semibold mt-10 font-psemibold">
            Sign up to Aora
          </Text>
          <FormField
            title="Username"
            handleChangeText={(text) =>
              setFormValues({ ...formValues, username: text })
            }
            value={formValues.username}
            otherStyles="mt-7"
          />
          <FormField
            title="Email"
            value={formValues.email}
            otherStyles="mt-7"
            keyboardType="email-address"
            handleChangeText={(text) =>
              setFormValues({ ...formValues, email: text })
            }
          />
          <FormField
            title="Password"
            value={formValues.password}
            otherStyles="mt-7"
            handleChangeText={(text) =>
              setFormValues({ ...formValues, password: text })
            }
          />
          <CustomButton
            title="Sign up"
            handlePress={handleRegister}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/login"
              className="text-sm text-secondary font-psemibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
