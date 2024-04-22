import { useState } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPostsByUser } from "../../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";

import useAppwrite from "../../../lib/useAppwrite";
import VideoCard from "../../../components/VideoCard";
import EmptyState from "../../../components/EmptyState";

const Profile = () => {
  const { id } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => getPostsByUser(id));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
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
            creatorId={item.creatorId}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-11 px-4 space-y-6">
            <View className="flex flex-col justify-center items-center space-y-4">
              <View className="rounded-sm border-2 border-secondary w-[56px] h-[56px]">
                <Image
                  source={{ uri: posts[0]?.creator.avatar }}
                  resizeMode="cover"
                  className="w-full h-full rounded-sm"
                />
              </View>
              <Text className="text-xl font-pmedium text-white">
                {posts[0]?.creator.username}
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
            subtitle={`Be the first one to upload a video!`}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
