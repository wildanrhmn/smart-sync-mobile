import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";

import OutsidePressHandler from "react-native-outside-press";

const VideoCard = ({ title, creatorId, creator, avatar, thumbnail, video }) => {
  const [play, setPlay] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
 
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="relative flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <TouchableOpacity
            onPress={() => router.push(`/profile/${creatorId}`)}
            className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5"
          >
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View className="flex flex-1 justify-center ml-3 gap-y-1">
            <Text className="font-pbold text-sm text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text
              onPress={() => router.push(`/profile/${creatorId}`)}
              className="font-pregular text-xs text-gray-100"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="pt-2"
          onPress={() => setMenuActive(true)}
        >
          <Image source={icons.menu} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>

        {menuActive && (
          <OutsidePressHandler onOutsidePress={() => setMenuActive(false)} className="absolute right-0 -bottom-20 z-50">
            <View
              className="bg-black-100 border-2 border-black-200 min-w-[150px] py-3 rounded-xl px-5 space-y-5"
            >
              <TouchableOpacity className="flex flex-row space-x-3 items-center">
                <Image
                  source={icons.bookmark}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex flex-row space-x-3 items-center">
                <Image
                  source={icons.bookmark}
                  className="w-4 h-4"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </OutsidePressHandler>
        )}
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
          onPress={() => setPlay(true)}
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
