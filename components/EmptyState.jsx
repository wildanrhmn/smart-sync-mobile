import { View, Text, Image } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle, showButton = true }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />

      <Text className="text-white font-psemibold text-2xl">{title}</Text>
      <Text className="text-gray-100 font-pmedium text-sm">{subtitle}</Text>

      {showButton && (        
        <CustomButton
          title="Create a Video"
          onPress={() => router.replace("/create")}
          containerStyles="w-full mt-7"
        />
      )}
    </View>
  );
};

export default EmptyState;
