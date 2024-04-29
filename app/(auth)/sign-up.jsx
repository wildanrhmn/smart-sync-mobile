import { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useForm } from "react-hook-form";
import { formRegisterSchema } from "../../lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import Toast from "react-native-root-toast";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
const SignUp = () => {
  const { loading, setLoading, setUser, setIsLoggedIn } = useGlobalContext();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formRegisterSchema),
  });

  const submit = async (data) => {
    setLoading(true);
    try {
      const result = await createUser(data.username, data.email, data.password);
      setUser(result);
      setIsLoggedIn(true);

      Toast.show("Successfully registered.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[90vh] justify-center px-6 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[110px] h-[75px]"
          />

          <Text className="text-white text-2xl text-semibold mt-5 font-psemibold">
            Sign Up to Smart Sync
          </Text>

          <FormField
            control={control}
            name="username"
            title="Username"
            otherStyles="mt-11"
          />

          <FormField
            control={control}
            name="email"
            title="Email"
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            control={control}
            name="password"
            title="Password"
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            onPress={handleSubmit(submit)}
            isLoading={loading}
            containerStyles="mt-7"
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-gray-100 text-lg font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-orange font-psemibold text-lg underline"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
