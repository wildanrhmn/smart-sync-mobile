import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { bookmarkVideo, unbookmarkVideo, getCurrentUser } from "../lib/appwrite";

import OutsidePressHandler from "react-native-outside-press";
import Toast from "react-native-root-toast";

const VideoCard = ({
  title,
  creatorId,
  creator,
  avatar,
  thumbnail,
  video,
  videoId,
}) => {
  const { user, setUser } = useGlobalContext();

  const [play, setPlay] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const onBookmarkVideo = async () => {
    try {
      await bookmarkVideo(videoId, user?.$id);

      Toast.show("Successfully bookmarked video.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });

      await getCurrentUser()
      .then((result) => setUser(result));
    } catch (error) {
      console.log(error);
    }
  };

  const onUnbookmarkVideo = async () => {
    try {
      await unbookmarkVideo(videoId, user?.$id);

      Toast.show("Successfully unbookmarked video.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });

      await getCurrentUser()
      .then((result) => setUser(result));
    } catch (error) {
      console.log(error);
    }
  };

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
        <TouchableOpacity className="pt-2" onPress={() => setMenuActive(true)}>
          <Image source={icons.menu} className="w-6 h-6" resizeMode="contain" />
        </TouchableOpacity>

        {menuActive && (
          <OutsidePressHandler
            onOutsidePress={() => setMenuActive(false)}
            className="min-w-[150px] min-h-[150px] absolute right-0 -bottom-36 z-50"
          >
            <View className="bg-black-100 border-2 border-black-200 py-3 rounded-xl px-5 space-y-5">
              {user && (
                <TouchableOpacity
                  className="flex flex-row space-x-3 items-center"
                  onPress={
                    user.bookmarks.findIndex(
                      (bookmark) => bookmark.$id === videoId
                    ) !== -1
                      ? onUnbookmarkVideo
                      : onBookmarkVideo
                  }
                >
                  <Image
                    source={icons.bookmark}
                    className="w-4 h-4"
                    resizeMode="contain"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    {user.bookmarks.findIndex(
                      (bookmark) => bookmark.$id === videoId
                    ) !== -1
                      ? "Unsave"
                      : "Save"}
                  </Text>
                </TouchableOpacity>
              )}

              {user && user.$id === creatorId && (
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
              )}
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
