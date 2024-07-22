import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

const Register = () => {
  const formValues = {
    email: "",
    password: "",
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        "http://192.168.5.106:3000/login",
        values
      );

      console.log(response.data);

      Alert.alert("Success", "Login successful");
      resetForm();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.erroMessage);

      console.log(error);
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
            initialValues={formValues}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              errors,
              isSubmitting,
              handleSubmit,
              values,
              touched,
            }) => (
              <>
                <FormField
                  title="Email"
                  value={values.email}
                  otherStyles="mt-7"
                  handleChangeText={handleChange("email")}
                  keyboardType="email-address"
                  error={errors.email && errors.email}
                  touch={touched.email}
                />
                <FormField
                  title="Password"
                  value={values.password}
                  otherStyles="mt-7"
                  handleChangeText={handleChange("password")}
                  error={errors.password && errors.password}
                  touch={touched.password}
                />
                <CustomButton
                  title="Sign up"
                  handlePress={handleSubmit}
                  containerStyles="mt-7"
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

export default Register;
