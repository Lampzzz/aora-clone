import { Link } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { View, Text, Image, Alert, ToastAndroid } from "react-native";

import { images } from "@/constants";
import FormField from "@/components/ui/FormField";
import { register } from "@/firebase/auth";
import Container from "@/components/ui/Container";
import GoogleButton from "@/components/ui/GoogleButton";
import Button from "@/components/ui/Button";

const registerValidatonSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
  const registerFormValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleRegister = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      await register(values.email, values.password);
      ToastAndroid.show("Created Successfully", ToastAndroid.SHORT);

      resetForm();
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        Alert.alert("Error", error.message);
      }
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
          Sign up to Aora
        </Text>
        <Formik
          initialValues={registerFormValues}
          validationSchema={registerValidatonSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, errors, isSubmitting, handleSubmit, values }) => (
            <>
              <FormField
                title="Username"
                value={values.username}
                placeholder={"Enter you username"}
                styles="mt-5"
                handleChangeText={handleChange("username")}
                keyboardType="username"
                error={errors.username && errors.email}
              />
              <FormField
                title="Email"
                value={values.email}
                placeholder={"Enter you email"}
                styles="mt-5"
                handleChangeText={handleChange("email")}
                keyboardType="email-address"
                error={errors.email && errors.email}
              />
              <FormField
                title="Password"
                value={values.password}
                placeholder={"Enter you password"}
                styles="mt-5"
                handleChangeText={handleChange("password")}
                error={errors.password && errors.password}
              />
              <Button
                title="Create"
                handlePress={handleSubmit}
                styles="mt-7"
                isLoading={isSubmitting}
              />

              <GoogleButton label={"Sign up with Google"} />
            </>
          )}
        </Formik>

        <View className="justify-center flex-row gap-2 mt-5">
          <Text className="text-sm text-gray-100 font-pregular">
            Have an account already?
          </Text>
          <Link href="/login" className="text-sm text-secondary font-psemibold">
            Sign In
          </Link>
        </View>
      </View>
    </Container>
  );
};

export default Register;
