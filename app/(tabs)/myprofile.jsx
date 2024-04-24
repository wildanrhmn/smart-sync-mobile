import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPostsByUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import { userLogout } from "../../lib/appwrite";

import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";
import Toast from "react-native-root-toast";

const MyProfile = () => {
  const { data: posts, refetch } = useAppwrite(() => getPostsByUser(user.$id));
  const { user, setUser, setLoading, setIsLoggedIn } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const logout = async () => {
    setLoading(true);
    try {
      await userLogout();
      setUser(null);
      setIsLoggedIn(false);

      Toast.show('Successfully logged out.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      })
      
      router.push("/sign-in");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creatorId={item.creator.$id}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="mt-6 mb-11 px-4 space-y-6">
            <View className="flex flex-1 items-end mr-3">
              <TouchableOpacity activeOpacity={0.7} onPress={logout}>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col justify-center items-center space-y-4">
              <View className="rounded-sm border-2 border-secondary w-[56px] h-[56px]">
                <Image
                  source={{ uri: user?.avatar }}
                  resizeMode="cover"
                  className="w-full h-full rounded-sm"
                />
              </View>
              <Text className="text-xl font-pmedium text-white">
                {user?.username}
              </Text>
              <View className="flex flex-row flex-1 items-center space-x-11">
                <View className="flex items-center justify-center">
                  <Text className="font-psemibold text-xl text-white">10</Text>
                  <Text className="font-pregular text-md text-white">
                    Posts
                  </Text>
                </View>
                <View className="flex items-center justify-center">
                  <Text className="font-psemibold text-xl text-white">
                    1.2K
                  </Text>
                  <Text className="font-pregular text-md text-white">
                    Views
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={`No Video Found`}
            subtitle={`Go and upload your first video!`}
            showButton={false}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default MyProfile;
