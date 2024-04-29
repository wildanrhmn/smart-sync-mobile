import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVideoSchema } from "../../lib/schema";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { submitVideo } from "../../lib/appwrite";
import { router } from "expo-router";

import FormField from "../../components/FormField";
import Toast from "react-native-root-toast";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";

const Create = () => {
  const { loading, setLoading, user } = useGlobalContext();
  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      title: "",
      prompt: "",
      video: null,
      thumbnail: null,
    },
    resolver: zodResolver(createVideoSchema),
  });
  const watchVideoExist = watch("video", null);
  const watchThumbnailExist = watch("thumbnail", null);

  const submit = async (data) => {
    const video = watchVideoExist ? getValues("video") : null;
    const thumbnail = watchThumbnailExist ? getValues("thumbnail") : null;

    if (!video && !thumbnail) {
      Toast.show("Please select video or thumbnail", {
        position: Toast.positions.BOTTOM,
        backgroundColor: "red",
        textColor: "white",
        opacity: 1,
      });
      return;
    }

    setLoading(true);
    const payload = {
      title: data.title,
      prompt: data.prompt,
      video: video,
      thumbnail: thumbnail,
      creator: user.$id,
    };

    try {
      await submitVideo(payload)
      .then(() => {
        Toast.show("Successfully created video.", {
          position: Toast.positions.BOTTOM,
          backgroundColor: "green",
          textColor: "white",
          opacity: 1,
        })
        router.replace("/home");
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/jpg", "image/jpeg", "image/png"]
          : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setValue("thumbnail", result.assets[0]);
      }
      if (selectType === "video") {
        setValue("video", result.assets[0]);
      }
    } else {
      Toast.show("No file selected", {
        position: Toast.positions.BOTTOM,
        backgroundColor: "red",
        textColor: "white",
        opacity: 1,
      });
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white text-2xl font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          name="title"
          control={control}
          placeholder="Give your video a title..."
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {watchVideoExist ? (
              <Video
                source={{ uri: getValues("video").uri }}
                className="w-full h-64 rounded-2xl"
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {watchThumbnailExist ? (
              <Image
                source={{ uri: getValues("thumbnail").uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          control={control}
          title="Input Prompt"
          name="prompt"
          placeholder="Prompt you used to create the video..."
          otherStyles="mt-10"
        />

        <CustomButton
          title="Create"
          onPress={handleSubmit(submit)}
          containerStyles="my-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
