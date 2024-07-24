import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { collection, addDoc, query, getDocs, where } from "@firebase/firestore";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { auth, db } from "../../services/firebase";

const Register = () => {
  const registerSchema = Yup.object().shape({
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

  const formValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleRegister = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    try {
      const usernameExists = await checkFieldExists(
        "username",
        values.username
      );
      const emailExists = await checkFieldExists("email", values.email);

      if (usernameExists) {
        setErrors({
          username: "Username is already in use",
        });
      }

      if (emailExists) {
        setErrors({
          email: "Email is already in use",
        });
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const userData = {
        username: values.username,
        email: values.email,
      };

      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        ...userData,
      });

      Alert.alert("Success", "Registration successful");
      resetForm();
    } catch (error) {
      console.log(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const checkFieldExists = async (fieldName, fieldValue) => {
    const q = query(
      collection(db, "users"),
      where(fieldName, "==", fieldValue)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
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
          <Formik
            initialValues={formValues}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
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
                  title="Username"
                  value={values.username}
                  handleChangeText={handleChange("username")}
                  otherStyles="mt-7"
                  error={errors.username && errors.username}
                  touch={touched.username}
                />
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
