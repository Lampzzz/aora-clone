import * as Yup from "yup";
import { Formik } from "formik";
import { Link, router, usePathname } from "expo-router";
import { useEffect } from "react";
import { View, Text, Image, Alert } from "react-native";

import { images } from "@/constants";
import { login } from "@/firebase/auth";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import GoogleButton from "@/components/ui/GoogleButton";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const pathname = usePathname();
  const loginFormValues = {
    email: "Lampz@gmail.com",
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
    <Container>
      <View className="flex-1 justify-center px-4 my-6">
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
          {({
            handleChange,
            errors,
            isSubmitting,
            handleSubmit,
            values,
            resetForm,
          }) => {
            useEffect(() => {
              resetForm();
            }, [pathname]);

            return (
              <>
                <FormField
                  title="Email"
                  value={values.email}
                  placeholder={"Enter your email"}
                  styles="mt-5"
                  handleChangeText={handleChange("email")}
                  keyboardType="email-address"
                  error={errors.email && errors.email}
                />
                <FormField
                  title="Password"
                  value={values.password}
                  placeholder={"Enter your password"}
                  styles="mt-5"
                  handleChangeText={handleChange("password")}
                  error={errors.password && errors.password}
                />
                <Button
                  title="Login"
                  handlePress={handleSubmit}
                  isLoading={isSubmitting}
                  styles="mt-7"
                />
                <GoogleButton label={"Sign in with Google"} />
              </>
            );
          }}
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
    </Container>
  );
};

export default Login;
