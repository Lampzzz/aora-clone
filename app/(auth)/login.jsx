import * as Yup from "yup";
import { Formik } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { View, Text, ScrollView, Image, Alert } from "react-native";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants";
import { login } from "@/firebase/auth";
import FormField from "@/components/FormField";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const loginFormValues = {
    email: "lampz@gmail.com",
    password: "123456",
  };

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    try {
      await login(values.email, values.password);
      router.replace("/home");
      resetForm();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
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
            Log in to Aora
          </Text>
          <Formik
            initialValues={loginFormValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, errors, isSubmitting, handleSubmit, values }) => (
              <>
                <FormField
                  title="Email"
                  value={values.email}
                  otherStyles="mt-5"
                  handleChangeText={handleChange("email")}
                  keyboardType="email-address"
                  error={errors.email && errors.email}
                />
                <FormField
                  title="Password"
                  value={values.password}
                  otherStyles="mt-5"
                  handleChangeText={handleChange("password")}
                  error={errors.password && errors.password}
                />
                <CustomButton
                  title="Login"
                  handlePress={handleSubmit}
                  containerStyles="mt-5"
                  isLoading={isSubmitting}
                />
              </>
            )}
          </Formik>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link
              href="/register"
              className="text-sm text-secondary font-psemibold"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
